import guestsData from "@/data/guests.json";
import type { Guest } from "@/lib/types";

const guests = guestsData as Guest[];

export function getAllGuests(): Guest[] {
  return guests;
}

export function getGuestById(id: string): Guest | undefined {
  return guests.find((guest) => guest.id === id);
}
