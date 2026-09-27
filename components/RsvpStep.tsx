import type { GiftWithStock, Guest } from "@/lib/types";
import GiftGrid from "@/components/GiftGrid";

export default function RsvpStep({
  guest,
  gifts,
  loadingGifts,
  giftsError,
  numGuests,
  onNumGuestsChange,
  quantities,
  onQuantityChange,
  submitting,
  submitError,
  onRequestConfirm,
}: {
  guest: Guest;
  gifts: GiftWithStock[] | null;
  loadingGifts: boolean;
  giftsError: string | null;
  numGuests: number;
  onNumGuestsChange: (value: number) => void;
  quantities: Record<string, number>;
  onQuantityChange: (giftId: string, quantity: number) => void;
  submitting: boolean;
  submitError: string | null;
  onRequestConfirm: () => void;
}) {
  return (
    <>
      <div className="mx-auto text-center flex w-full max-w-lg flex-col gap-4 rounded-3xl">
        <h2 className="font-script text-3xl text-brand-dark">
          Confirma tu asistencia
        </h2>
        <p className="text-sm pt-4 text-foreground/70">
          Elige cuántos irán y, si quieres, resérvales uno o más regalos a{" "}
          {guest.name}.
        </p>
        

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-brand-dark">
            Número de personas que asistirán
          </span>
          <div className="relative">
            <select
              value={numGuests}
              onChange={(event) => onNumGuestsChange(Number(event.target.value))}
              disabled={submitting}
              className="w-full cursor-pointer appearance-none rounded-xl border-2 border-brand-light/50 bg-accent-cream py-2.5 pl-4 pr-12 text-foreground transition-colors hover:border-brand-light focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {Array.from({ length: guest.maxGuests }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              )}
            </select>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-dark"
            >
              <path
                d="m6 9 6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </label>

        <button
          type="button"
          onClick={onRequestConfirm}
          disabled={submitting}
          className="sticky w-full top-4 z-10 self-center rounded-full bg-brand px-6 py-2.5 font-display text-base font-semibold text-white shadow-md transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Confirmando..." : "Confirma tu asistencia"}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-3xl bg-surface p-6 shadow-xl">
        <h2 className="font-script text-3xl text-brand-dark">
          Lista de regalos (unisex)
        </h2>
        <p className="mb-2 text-sm font-semibold text-brand-dark">
          No sabemos si es niña / niño 🫢. Elige los regalos que quieres llevarle unisex
        </p>
        {loadingGifts && (
          <p className="text-sm text-foreground/60">Cargando regalos...</p>
        )}
        {giftsError && <p className="text-sm text-red-600">{giftsError}</p>}
        {gifts && (
          <GiftGrid
            gifts={gifts}
            quantities={quantities}
            disabled={submitting}
            onQuantityChange={onQuantityChange}
          />
        )}
        

        {submitError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}
      </div>
    </>
  );
}
