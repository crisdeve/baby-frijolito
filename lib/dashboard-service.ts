import { collection, getDocs } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { db, firebaseApp } from "@/lib/firebase";
import { getGiftsWithStock, withTimeout } from "@/lib/gifts-service";
import { getAllGuests } from "@/lib/guests";
import type { GiftWithStock, Guest } from "@/lib/types";

const CONFIRMATIONS_COLLECTION = "confirmaciones";
const CLAIMED_GIFTS_COLLECTION = "regalos-confirmados";

export type Confirmation = {
  guestId: string;
  name: string;
  numGuests: number;
  confirmedAt: string;
};

export type GiftClaim = {
  guestId: string;
  name: string;
  giftId: string;
  giftName: string;
  quantity: number;
  confirmedAt: string;
};

export type DashboardData = {
  guests: Guest[];
  confirmations: Confirmation[];
  claims: GiftClaim[];
  gifts: GiftWithStock[];
};

// Auth is only needed by the dashboard, so it's initialized lazily here
// instead of in lib/firebase.ts (which every invitation page loads).
function auth() {
  return getAuth(firebaseApp);
}

export function watchAdminUser(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth(), callback);
}

export function signInAdmin() {
  return signInWithPopup(auth(), new GoogleAuthProvider());
}

export function signOutAdmin() {
  return signOut(auth());
}

/**
 * Reads everything the dashboard needs. `confirmaciones` and
 * `regalos-confirmados` are only readable by signed-in users listed in the
 * `admins` collection (see firestore.rules), so this rejects with
 * `permission-denied` for anyone else.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [confirmationsSnap, claimsSnap, gifts] = await Promise.all([
    withTimeout(
      getDocs(collection(db, CONFIRMATIONS_COLLECTION)),
      "Tiempo de espera agotado al cargar las confirmaciones."
    ),
    withTimeout(
      getDocs(collection(db, CLAIMED_GIFTS_COLLECTION)),
      "Tiempo de espera agotado al cargar los regalos confirmados."
    ),
    getGiftsWithStock(),
  ]);

  return {
    guests: getAllGuests(),
    confirmations: confirmationsSnap.docs.map(
      (docSnap) => docSnap.data() as Confirmation
    ),
    claims: claimsSnap.docs.map((docSnap) => docSnap.data() as GiftClaim),
    gifts,
  };
}
