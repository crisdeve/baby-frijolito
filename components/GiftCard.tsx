import Image from "next/image";
import type { GiftWithStock } from "@/lib/types";

export default function GiftCard({
  gift,
  quantity,
  disabled,
  onQuantityChange,
}: {
  gift: GiftWithStock;
  quantity: number;
  disabled: boolean;
  onQuantityChange: (quantity: number) => void;
}) {
  const agotado = gift.stock <= 0;
  const remaining = gift.stock - quantity;

  return (
    <div
      className={`flex h-full flex-col items-center justify-between gap-2 rounded-2xl border-2 p-3 text-center transition-all ${
        quantity > 0
          ? "border-brand bg-brand-light/20 shadow-md"
          : "border-transparent bg-accent-cream"
      } ${agotado ? "opacity-50 grayscale" : ""}`}
    >
      {gift.url ? (
        <a
          href={gift.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver ${gift.name} en la tienda (se abre en una nueva pestaña)`}
          className="group flex flex-col items-center gap-2"
        >
          <div className="relative h-16 w-16">
            <Image
              src={gift.image}
              alt={gift.name}
              fill
              sizes="64px"
              className="object-contain"
            />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-md transition-colors group-hover:bg-brand-dark">
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="font-display text-sm font-semibold leading-tight text-foreground">
            {gift.name}
          </p>
          <p className="text-xs leading-snug text-foreground/70">
            {gift.description}
          </p>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-dark underline-offset-2 group-hover:underline">
            Ver producto
            <ExternalLinkIcon className="h-3 w-3" />
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              agotado
                ? "bg-foreground/10 text-foreground/60"
                : "bg-brand/10 text-brand-dark"
            }`}
          >
            {agotado ? "Agotado" : `Disponibles: ${remaining}`}
          </span>
        </a>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-16 w-16">
            <Image
              src={gift.image}
              alt={gift.name}
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <p className="font-display text-sm font-semibold leading-tight text-foreground">
            {gift.name}
          </p>
          <p className="text-xs leading-snug text-foreground/70">
            {gift.description}
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              agotado
                ? "bg-foreground/10 text-foreground/60"
                : "bg-brand/10 text-brand-dark"
            }`}
          >
            {agotado ? "Agotado" : `Disponibles: ${remaining}`}
          </span>
        </div>
      )}

      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          aria-label={`Quitar uno de ${gift.name}`}
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          disabled={disabled || quantity <= 0}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-lg font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="w-4 font-display text-lg font-bold text-brand-dark">
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`Agregar uno de ${gift.name}`}
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={disabled || agotado || remaining <= 0}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-lg font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
