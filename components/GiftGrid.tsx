import { useState } from "react";
import type { GiftCategory, GiftWithStock } from "@/lib/types";
import GiftCard from "@/components/GiftCard";

const CATEGORY_ORDER: GiftCategory[] = [
  "Muebles y descanso",
  "Para salir",
  "Higiene y básicos",
  "Ropita",
  "Salud y cuidado",
  "Lactancia",
];

export default function GiftGrid({
  gifts,
  quantities,
  disabled,
  onQuantityChange,
}: {
  gifts: GiftWithStock[];
  quantities: Record<string, number>;
  disabled: boolean;
  onQuantityChange: (giftId: string, quantity: number) => void;
}) {
  const byCategory = new Map<GiftCategory, GiftWithStock[]>();
  for (const gift of gifts) {
    const list = byCategory.get(gift.category) ?? [];
    list.push(gift);
    byCategory.set(gift.category, list);
  }
  const categories = CATEGORY_ORDER.filter((category) =>
    byCategory.has(category)
  );

  const [activeCategory, setActiveCategory] = useState<GiftCategory | null>(
    null
  );
  const active =
    activeCategory && categories.includes(activeCategory)
      ? activeCategory
      : categories[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-2">
        {categories.map((category) => {
          const hasSelection = (byCategory.get(category) ?? []).some(
            (gift) => (quantities[gift.id] ?? 0) > 0
          );
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === active
                  ? "bg-brand text-white shadow-md"
                  : "bg-accent-cream text-brand-dark hover:bg-brand-light/30"
              }`}
            >
              {category}
              {hasSelection && (
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-dark ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:grid-cols-3">
        {(byCategory.get(active) ?? []).map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            quantity={quantities[gift.id] ?? 0}
            disabled={disabled}
            onQuantityChange={(quantity) =>
              onQuantityChange(gift.id, quantity)
            }
          />
        ))}
      </div>
    </div>
  );
}
