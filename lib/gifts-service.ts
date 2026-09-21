import { collection, doc, getDocs, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import giftsCatalog from "@/data/gifts.json";
import type {
  ConfirmationResult,
  GiftSelection,
  GiftWithStock,
  Guest,
} from "@/lib/types";

const GIFTS_COLLECTION = "gifts";
const CONFIRMATIONS_COLLECTION = "confirmaciones";
const CLAIMED_GIFTS_COLLECTION = "regalos-confirmados";
const FIRESTORE_TIMEOUT_MS = 10_000;

const catalog = giftsCatalog as Omit<GiftWithStock, "stock">[];

// Firestore's SDK can retry silently for a long time against an
// unreachable/misconfigured project instead of rejecting, which would
// otherwise leave the UI stuck on a loading state forever.
function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  // The Firestore call itself isn't cancelable — if it loses the race and
  // rejects later on its own, catch it here so it doesn't surface as an
  // unhandled rejection.
  promise.catch(() => {});

  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), FIRESTORE_TIMEOUT_MS)
    ),
  ]);
}

/**
 * One read of the whole `gifts` collection, merged with the static catalog
 * (name/description/image) so each item's availability reflects the
 * current stock in Firestore.
 */
export async function getGiftsWithStock(): Promise<GiftWithStock[]> {
  const snapshot = await withTimeout(
    getDocs(collection(db, GIFTS_COLLECTION)),
    "Tiempo de espera agotado al cargar los regalos."
  );
  const stockById = new Map<string, number>();
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    stockById.set(docSnap.id, typeof data.stock === "number" ? data.stock : 0);
  });

  return catalog.map((item) => ({
    ...item,
    stock: stockById.get(item.id) ?? 0,
  }));
}

/**
 * Confirms attendance (`confirmaciones`, one per guest) and claims any
 * number of gifts with a quantity each (`regalos-confirmados`, one doc per
 * gift claimed), decrementing `gifts.stock` for each. Everything happens in
 * a single transaction: either the whole RSVP goes through, or none of it
 * does — no partially-claimed gifts, no double stock decrements.
 */
export async function confirmAttendance(
  guest: Guest,
  numGuests: number,
  selections: GiftSelection[]
): Promise<ConfirmationResult> {
  const confirmationRef = doc(db, CONFIRMATIONS_COLLECTION, guest.id);
  const giftRefs = selections.map((s) => doc(db, GIFTS_COLLECTION, s.id));

  try {
    await withTimeout(
      runTransaction(db, async (transaction) => {
        const confirmationSnap = await transaction.get(confirmationRef);
        if (confirmationSnap.exists()) {
          throw new ConfirmationError("ya-confirmado");
        }

        const giftSnaps = await Promise.all(
          giftRefs.map((ref) => transaction.get(ref))
        );

        const stocks = giftSnaps.map((snap) =>
          snap.exists() ? snap.data().stock ?? 0 : 0
        );

        for (let i = 0; i < selections.length; i++) {
          if (stocks[i] < selections[i].quantity) {
            throw new ConfirmationError("sin-stock", selections[i].id);
          }
        }

        transaction.set(confirmationRef, {
          guestId: guest.id,
          name: guest.name,
          numGuests,
          confirmedAt: new Date().toISOString(),
        });

        selections.forEach((selection, i) => {
          transaction.update(giftRefs[i], {
            stock: stocks[i] - selection.quantity,
          });

          const claimRef = doc(
            db,
            CLAIMED_GIFTS_COLLECTION,
            `${guest.id}_${selection.id}`
          );
          transaction.set(claimRef, {
            guestId: guest.id,
            name: guest.name,
            giftId: selection.id,
            giftName: selection.name,
            quantity: selection.quantity,
            confirmedAt: new Date().toISOString(),
          });
        });
      }),
      "Tiempo de espera agotado al confirmar tu asistencia."
    );

    return { ok: true };
  } catch (error) {
    if (error instanceof ConfirmationError) {
      return error.reason === "sin-stock"
        ? { ok: false, reason: "sin-stock", giftId: error.giftId! }
        : { ok: false, reason: error.reason };
    }
    console.error("Error al confirmar asistencia", error);
    return { ok: false, reason: "error" };
  }
}

class ConfirmationError extends Error {
  reason: "sin-stock" | "ya-confirmado";
  giftId?: string;
  constructor(reason: "sin-stock" | "ya-confirmado", giftId?: string) {
    super(reason);
    this.reason = reason;
    this.giftId = giftId;
  }
}
