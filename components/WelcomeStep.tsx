import { useState } from "react";
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
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return (
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-8 py-20">
        <button
          type="button"
          onClick={() => setOpened(true)}
          aria-label="Abrir la invitación"
          className="font-script text-4xl text-brand-dark"
        >
          abrir invitación
        </button>
        <BabyImage className="w-full" priority />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-8 py-20 text-center">
        <h1 className="font-script text-4xl text-brand-dark">
          ya falta poco
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
          className="w-full rounded-full bg-brand px-6 py-3 font-display text-lg font-semibold text-white shadow-md transition-colors hover:bg-brand-dark"
        >
          Acceder a la invitación
        </button>
      </div>
      <BabyImage className="w-full" />
    </div>
  );
}
