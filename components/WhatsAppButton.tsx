import { shippingInfo } from "@/lib/shipping";

export default function WhatsAppButton() {
  const digits = shippingInfo.phone.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed right-20 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-md transition-colors hover:bg-brand-dark"
    >
      <WhatsAppIcon />
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.6-1.21A9 9 0 1 0 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 8.8c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.2-.3.3-.4.5-.1.2-.3.3-.1.6.2.3.8 1.2 1.7 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1.2-.2.7-.8.9-1 .2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4.1.2.1.9-.2 1.4-.3.5-1.4 1.1-2 1.1-.5.1-1.1.1-3.6-1.1-2.9-1.4-4.6-4.2-4.7-4.4-.1-.2-.9-1.3-.9-2.4 0-1.1.6-1.7.8-1.9Z"
        fill="currentColor"
      />
    </svg>
  );
}
