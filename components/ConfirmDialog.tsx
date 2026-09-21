import type { GiftSelection } from "@/lib/types";

export default function ConfirmDialog({
  guestName,
  numGuests,
  selections,
  submitting,
  onCancel,
  onConfirm,
}: {
  guestName: string;
  numGuests: number;
  selections: GiftSelection[];
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-3xl bg-surface p-6 text-center shadow-2xl">
        <span className="text-4xl">⚠️</span>
        <h2 className="font-script text-3xl text-brand-dark">
          ¿Confirmar tu asistencia?
        </h2>
        <p className="text-sm text-foreground/80">
          Esta acción es <strong>irreversible</strong>: una vez confirmes, no
          podrás cambiar la cantidad de invitados ni los regalos elegidos
          desde aquí. Si necesitas hacer algún cambio después, comunícate
          directamente con el anfitrión.
        </p>

        <div className="rounded-2xl bg-brand-light/20 p-4 text-left">
          <p className="mb-2 text-sm font-semibold text-brand-dark">
            {guestName} · {numGuests}{" "}
            {numGuests === 1 ? "persona" : "personas"}
          </p>
          {selections.length > 0 ? (
            <ul className="flex flex-col gap-1 text-sm text-foreground/80">
              {selections.map((selection) => (
                <li key={selection.id} className="flex justify-between gap-2">
                  <span>{selection.name}</span>
                  <span className="font-semibold text-brand-dark">
                    ×{selection.quantity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/60">
              No elegiste ningún regalo.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 rounded-full bg-brand px-6 py-3 font-display text-base font-semibold text-white shadow-md transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Confirmando..." : "Sí, confirmar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-full border-2 border-brand-light/60 px-6 py-3 font-display text-base font-semibold text-brand-dark transition-colors hover:bg-brand-light/20 disabled:opacity-60"
          >
            Revisar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
