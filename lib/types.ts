export type Guest = {
  id: string;
  name: string;
  maxGuests: number;
};

export type GiftCategory =
  | "Muebles y descanso"
  | "Para salir"
  | "Higiene y básicos"
  | "Ropita"
  | "Salud y cuidado"
  | "Lactancia";

export type GiftCatalogItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: GiftCategory;
};

export type GiftWithStock = GiftCatalogItem & {
  stock: number;
};

export type GiftSelection = {
  id: string;
  name: string;
  quantity: number;
};

export type ConfirmationResult =
  | { ok: true }
  | { ok: false; reason: "sin-stock"; giftId: string }
  | { ok: false; reason: "ya-confirmado" | "error" };
