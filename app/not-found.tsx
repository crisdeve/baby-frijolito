export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-surface p-8 text-center shadow-xl">
        <span className="text-5xl">🍃</span>
        <h1 className="font-script text-4xl text-brand-dark">
          No encontramos esa invitación
        </h1>
        <p className="text-foreground/80">
          Revisa que el link sea el mismo que te compartimos por WhatsApp.
        </p>
      </div>
    </main>
  );
}
