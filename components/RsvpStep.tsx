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
  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-3xl bg-surface p-6 shadow-xl">
      <div>
        <h2 className="font-script text-3xl text-brand-dark">
          Confirma tu asistencia
        </h2>
        <p className="text-sm pt-4 text-foreground/70">
          Elige cuántos irán y, si quieres, resérvales uno o más regalos a{" "}
          {guest.name}.
        </p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-brand-dark">
          Número de personas que asistirán
        </span>
        <select
          value={numGuests}
          onChange={(event) => onNumGuestsChange(Number(event.target.value))}
          disabled={submitting}
          className="rounded-xl border-2 border-brand-light/50 bg-accent-cream px-4 py-2 text-foreground focus:border-brand focus:outline-none"
        >
          {Array.from({ length: guest.maxGuests }, (_, i) => i + 1).map(
            (n) => (
              <option key={n} value={n}>
                {n}
              </option>
            )
          )}
        </select>
      </label>

      <div>
        <p className="mb-2 text-sm font-semibold text-brand-dark">
          Elige los regalos que quieres llevarle
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
      </div>

      {submitError && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={onRequestConfirm}
        disabled={submitting || totalSelected === 0}
        className="w-full rounded-full bg-brand px-6 py-3 font-display text-lg font-semibold text-white shadow-md transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting
          ? "Confirmando..."
          : totalSelected > 0
            ? "Confirmar asistencia"
            : "Elige al menos un regalo para continuar"}
      </button>
    </div>
  );
}
