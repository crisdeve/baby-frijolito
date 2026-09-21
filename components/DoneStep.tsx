import type { GiftSelection } from "@/lib/types";


export default function DoneStep({
  guestName,
  selections,
}: {
  guestName: string;
  selections: GiftSelection[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-surface p-8 text-center shadow-xl">
      <h2 className="font-script text-4xl text-brand-dark">
        ¡Gracias, {guestName}!
      </h2>
      <p className="text-foreground/80">Tu confirmación quedó registrada.</p>

      {selections.length > 0 && (
        <div className="w-full rounded-2xl bg-brand-light/20 p-4 text-left">
          <p className="mb-2 text-sm font-semibold text-brand-dark">
            Regalos que reservaste:
          </p>
          <ul className="flex flex-col gap-1 text-sm text-foreground/80">
            {selections.map((selection) => (
              <li key={selection.id} className="flex justify-between">
                <span>{selection.name}</span>
                <span className="font-semibold text-brand-dark">
                  ×{selection.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-foreground/60">
        Te esperamos con muchísimo cariño para celebrar juntos. 🌿
      </p>
    </div>
  );
}
