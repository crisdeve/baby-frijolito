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
