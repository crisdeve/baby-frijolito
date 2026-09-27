"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { babyShowerEvent } from "@/lib/event";

type Detail = "fecha" | "lugar" | "direccion";

const BUTTONS: { id: Detail; icon: string; label: string }[] = [
  { id: "fecha", icon: "/icons/calendario.svg", label: "Fecha y hora" },
  { id: "lugar", icon: "/icons/ubicacion.svg", label: "Lugar" },
  { id: "direccion", icon: "/icons/mapa.svg", label: "Dirección" },
];

export default function EventDetails({
  onConfirmClick,
}: {
  onConfirmClick?: () => void;
}) {
  const [open, setOpen] = useState<Detail | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <nav
        aria-label="Detalles del evento"
        className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit gap-2 rounded-full border-2 border-brand-light/60 bg-surface p-2 shadow-xl"
      >
        {BUTTONS.map((button) => (
          <button
            key={button.id}
            type="button"
            onClick={() => setOpen(button.id)}
            aria-label={button.label}
            aria-haspopup="dialog"
            className="flex flex-col items-center gap-0.5 rounded-full px-3 py-1 transition-colors hover:bg-brand-light/20"
          >
            <Image
              src={assetPath(button.icon)}
              alt=""
              width={200}
              height={200}
              className="h-9 w-9"
            />
            <span className="text-[11px] font-semibold text-brand-dark">
              {button.label}
            </span>
          </button>
        ))}
        {onConfirmClick && (
          <button
            type="button"
            onClick={onConfirmClick}
            aria-label="Confirmar asistencia y regalos"
            className="flex flex-col items-center gap-0.5 rounded-full px-3 py-1 transition-colors hover:bg-brand-light/20"
          >
            <Image
              src={assetPath("/icons/confirmar.svg")}
              alt=""
              width={200}
              height={200}
              className="h-9 w-9"
            />
            <span className="text-[11px] font-semibold text-brand-dark">
              Confirmar
            </span>
          </button>
        )}
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-detail-title"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-surface p-6 text-center shadow-2xl"
          >
            <DetailContent detail={open} />
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="rounded-full border-2 border-brand-light/60 px-6 py-2 font-display text-base font-semibold text-brand-dark transition-colors hover:bg-brand-light/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function DetailContent({ detail }: { detail: Detail }) {
  if (detail === "fecha") {
    return (
      <>
        <Image src={assetPath("/icons/calendario.svg")} alt="" width={200} height={200} className="h-16 w-16" />
        <h2 id="event-detail-title" className="font-script text-3xl text-brand-dark">
          Fecha y hora
        </h2>
        <p className="text-foreground/80">{babyShowerEvent.date}</p>
        <p className="flex items-center gap-2 text-foreground/80">
          <Image src={assetPath("/icons/reloj.svg")} alt="" width={200} height={200} className="h-6 w-6" />
          {babyShowerEvent.time}
        </p>
      </>
    );
  }

  if (detail === "lugar") {
    return (
      <>
        <Image src={assetPath("/icons/ubicacion.svg")} alt="" width={200} height={200} className="h-16 w-16" />
        <h2 id="event-detail-title" className="font-script text-3xl text-brand-dark">
          Lugar
        </h2>
        <p className="text-foreground/80">{babyShowerEvent.venueName}</p>
      </>
    );
  }

  return (
    <>
      <Image src={assetPath("/icons/mapa.svg")} alt="" width={200} height={200} className="h-16 w-16" />
      <h2 id="event-detail-title" className="font-script text-3xl text-brand-dark">
        Dirección
      </h2>
      <p className="text-foreground/80">{babyShowerEvent.address}</p>
      <a
        href={babyShowerEvent.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-brand px-6 py-2 font-display text-base font-semibold text-white shadow-md transition-colors hover:bg-brand-dark"
      >
        Ver ubicación en el mapa
      </a>
    </>
  );
}
