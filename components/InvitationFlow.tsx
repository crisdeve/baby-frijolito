"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GiftSelection, GiftWithStock, Guest } from "@/lib/types";
import { confirmAttendance, getGiftsWithStock } from "@/lib/gifts-service";
import WelcomeStep from "@/components/WelcomeStep";

import EventDetails from "@/components/EventDetails";
import RsvpStep from "@/components/RsvpStep";
import ConfirmDialog from "@/components/ConfirmDialog";
import DoneStep from "@/components/DoneStep";
import MusicToggle from "@/components/MusicToggle";

type Step = "invitacion" | "confirmado";

const DETAILS_SECTION_ID = "detalle-invitacion";

const GENERIC_ERROR_MESSAGES: Record<string, string> = {
  "ya-confirmado": "Ya habías confirmado tu asistencia antes. ¡Gracias!",
  error: "Algo salió mal al guardar tu confirmación. Intenta de nuevo.",
};

export default function InvitationFlow({ guest }: { guest: Guest }) {
  const [step, setStep] = useState<Step>("invitacion");

  const [gifts, setGifts] = useState<GiftWithStock[] | null>(null);
  const [loadingGifts, setLoadingGifts] = useState(true);
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

  useEffect(() => {
    let cancelled = false;

    getGiftsWithStock()
      .then((result) => {
        if (!cancelled) setGifts(result);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setGiftsError("No pudimos cargar los regalos disponibles.");
      })
      .finally(() => {
        if (!cancelled) setLoadingGifts(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function scrollToDetails() {
    document
      .getElementById(DETAILS_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth" });
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
      setGifts(
        (current) =>
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
    <main className="flex flex-1 flex-col items-center pb-28">
      <button
        type="button"
        onClick={() => window.location.reload()}
        aria-label="Recargar la invitación"
        className="fixed left-4 top-4 z-50 h-11 w-11 rounded-full shadow-md transition-transform hover:scale-105"
      >
        <Image
          src="/icons/bebe.svg"
          alt=""
          width={100}
          height={100}
          className="h-full w-full"
        />
      </button>
      <MusicToggle />
      <EventDetails
        onConfirmClick={step === "invitacion" ? scrollToDetails : undefined}
      />

      {step === "invitacion" && (
        <>
          <WelcomeStep guest={guest} onAccept={scrollToDetails} />
          <div
            id={DETAILS_SECTION_ID}
            className="flex w-full scroll-mt-6 flex-col items-center gap-6 px-4 py-20"
          >
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
        </>
      )}

      {step === "confirmado" && (
        <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-12">
          <DoneStep guestName={guest.name} selections={confirmedSelections} />
        </div>
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
