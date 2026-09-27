import type { Guest } from "@/lib/types";
import { babyShowerEvent } from "@/lib/event";
import BabyImage from "@/components/BabyImage";

export default function WelcomeStep({
  guest,
  onAccept,
}: {
  guest: Guest;
  onAccept: () => void;
}) {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-8 pt-20 text-center">
        <h1 className="font-script text-4xl text-brand-dark">
          Vamos a ser padres
        </h1>
        <p className="text-foreground/80">{babyShowerEvent.message}</p>
        <div className="rounded-2xl bg-brand-light/20 px-5 py-4">
          <p className="font-display text-lg font-semibold text-brand-dark">
            ¡Hola, {guest.name}!
          </p>
          <p className="text-sm text-foreground/70">
            Tienes {guest.maxGuests}{" "}
            {guest.maxGuests === 1 ? "espacio reservado" : "espacios reservados"}{" "}
            para ti{guest.maxGuests > 1 ? " y tu familia" : ""}.
          </p>
        </div>
        <button
          type="button"
          onClick={onAccept}
          className="rounded-full bg-brand px-6 py-3 font-display text-lg font-semibold text-white shadow-md transition-colors hover:bg-brand-dark"
        >
          Confirma tu asistencia
        </button>
      </div>
      <BabyImage className="w-full" priority />
    </div>
  );
}
