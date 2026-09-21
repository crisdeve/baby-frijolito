import Image from "next/image";
import { babyShowerEvent } from "@/lib/event";

export default function EventDetails() {
  return (
    <div className="w-full max-w-lg grid gap-3 rounded-3xl bg-surface p-6 shadow-xl sm:grid-cols-2">
      <InfoItem
        icon="/icons/calendario.svg"
        label="Fecha"
        value={babyShowerEvent.date}
      />
      <InfoItem
        icon="/icons/reloj.svg"
        label="Hora"
        value={babyShowerEvent.time}
      />
      <InfoItem
        icon="/icons/ubicacion.svg"
        label="Lugar"
        value={babyShowerEvent.venueName}
      />
      <InfoItem
        icon="/icons/mapa.svg"
        label="Dirección"
        value={babyShowerEvent.address}
      />
      <a
        href={babyShowerEvent.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-full text-center text-sm font-semibold text-brand-dark underline underline-offset-4"
      >
        Ver ubicación en el mapa
      </a>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-accent-cream p-3">
      <Image
        src={icon}
        alt=""
        width={200}
        height={200}
        className="h-9 w-9 shrink-0"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {label}
        </p>
        <p className="text-sm text-foreground/80">{value}</p>
      </div>
    </div>
  );
}
