import { babyShowerEvent } from "@/lib/event";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-surface p-8 text-center shadow-xl">
        <span className="text-5xl">🌿👶🌿</span>
        <h1 className="font-script text-5xl text-brand-dark">
          Baby Shower de {babyShowerEvent.babyName}
        </h1>
        <p className="text-foreground/80">
          Esta invitación es personal. Usa el link que te enviamos por
          WhatsApp para ver tu mensaje y confirmar tu asistencia.
        </p>
      </div>
    </main>
  );
}
