"use client";

import { useState } from "react";
import type { GiftSelection, GiftWithStock, Guest } from "@/lib/types";
import { confirmAttendance, getGiftsWithStock } from "@/lib/gifts-service";
import WelcomeStep from "@/components/WelcomeStep";

import EventDetails from "@/components/EventDetails";
import RsvpStep from "@/components/RsvpStep";
import ConfirmDialog from "@/components/ConfirmDialog";
import DoneStep from "@/components/DoneStep";

type Step = "bienvenida" | "invitacion" | "confirmado";

const GENERIC_ERROR_MESSAGES: Record<string, string> = {
  "ya-confirmado": "Ya habías confirmado tu asistencia antes. ¡Gracias!",
  error: "Algo salió mal al guardar tu confirmación. Intenta de nuevo.",
};

export default function InvitationFlow({ guest }: { guest: Guest }) {
  const [step, setStep] = useState<Step>("bienvenida");

  const [gifts, setGifts] = useState<GiftWithStock[] | null>(null);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [giftsError, setGiftsError] = useState<string | null>(null);

  const [numGuests, setNumGuests] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedSelections, setConfirmedSelections] = useState<
    GiftSelection[]
  >([]);

  const selections: GiftSelection[] = (gifts ?? [])
    .filter((gift) => (quantities[gift.id] ?? 0) > 0)
    .map((gift) => ({
      id: gift.id,
      name: gift.name,
      quantity: quantities[gift.id],
    }));

  async function handleAccept() {
    setStep("invitacion");
    if (gifts || loadingGifts) return;

    setLoadingGifts(true);
    setGiftsError(null);
    try {
      const result = await getGiftsWithStock();
      setGifts(result);
    } catch (error) {
      console.error(error);
      setGiftsError("No pudimos cargar los regalos disponibles.");
    } finally {
      setLoadingGifts(false);
    }
  }

  function handleQuantityChange(giftId: string, quantity: number) {
    setQuantities((current) => ({ ...current, [giftId]: quantity }));
  }

  async function handleFinalConfirm() {
    setShowConfirmDialog(false);
    setSubmitting(true);
    setSubmitError(null);

    const result = await confirmAttendance(guest, numGuests, selections);

    if (result.ok) {
      setConfirmedSelections(selections);
      setStep("confirmado");
    } else if (result.reason === "sin-stock") {
      const outOfStockGift = gifts?.find((g) => g.id === result.giftId);
      setSubmitError(
        `Justo se acabó "${outOfStockGift?.name ?? "ese regalo"}". Ajusta la cantidad e intenta de nuevo.`
      );
      setGifts((current) =>
        current?.map((g) =>
          g.id === result.giftId ? { ...g, stock: 0 } : g
        ) ?? current
      );
      setQuantities((current) => ({ ...current, [result.giftId]: 0 }));
    } else {
      setSubmitError(
        GENERIC_ERROR_MESSAGES[result.reason] ?? GENERIC_ERROR_MESSAGES.error
      );
    }

    setSubmitting(false);
  }

  return (
    <main
      className={`flex flex-1 flex-col items-center justify-center gap-8 ${
        step === "bienvenida" ? "" : "px-4 py-12"
      }`}
    >
      {step === "bienvenida" && (
        <WelcomeStep guest={guest} onAccept={handleAccept} />
      )}

      {step === "invitacion" && (
        <div className="flex w-full flex-col items-center gap-6">
          <EventDetails />
          <RsvpStep
            guest={guest}
            gifts={gifts}
            loadingGifts={loadingGifts}
            giftsError={giftsError}
            numGuests={numGuests}
            onNumGuestsChange={setNumGuests}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            submitting={submitting}
            submitError={submitError}
            onRequestConfirm={() => setShowConfirmDialog(true)}
          />
        </div>
      )}

      {step === "confirmado" && (
        <DoneStep guestName={guest.name} selections={confirmedSelections} />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          guestName={guest.name}
          numGuests={numGuests}
          selections={selections}
          submitting={submitting}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={handleFinalConfirm}
        />
      )}
    </main>
  );
}
