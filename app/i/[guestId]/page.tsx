import { notFound } from "next/navigation";
import { getAllGuests, getGuestById } from "@/lib/guests";
import InvitationFlow from "@/components/InvitationFlow";

export function generateStaticParams() {
  return getAllGuests().map((guest) => ({ guestId: guest.id }));
}

export const dynamicParams = false;

export default async function GuestInvitationPage(
  props: PageProps<"/i/[guestId]">
) {
  const { guestId } = await props.params;
  const guest = getGuestById(guestId);

  if (!guest) {
    notFound();
  }

  return <InvitationFlow guest={guest} />;
}
