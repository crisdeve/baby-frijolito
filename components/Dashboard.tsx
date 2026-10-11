"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  getDashboardData,
  signInAdmin,
  signOutAdmin,
  watchAdminUser,
  type DashboardData,
} from "@/lib/dashboard-service";
import { babyShowerEvent } from "@/lib/event";

export default function Dashboard() {
  // undefined = still resolving the persisted session.
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getDashboardData());
    } catch (err) {
      console.error(err);
      setData(null);
      setError(
        err instanceof FirebaseError && err.code === "permission-denied"
          ? "Esta cuenta no tiene permiso para ver el dashboard."
          : "No pudimos cargar los datos. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    () =>
      watchAdminUser((nextUser) => {
        setUser(nextUser);
        if (nextUser) load();
        else setData(null);
      }),
    [load]
  );

  if (user === undefined) {
    return <CenteredCard>Cargando…</CenteredCard>;
  }

  if (!user) {
    return (
      <CenteredCard>
        <h1 className="font-display text-2xl font-bold text-brand-dark">
          Dashboard del baby shower
        </h1>
        <p className="text-foreground/80">
          Inicia sesión con una cuenta autorizada para ver las métricas.
        </p>
        <button
          type="button"
          onClick={() => signInAdmin().catch((err) => console.error(err))}
          className="rounded-full bg-brand px-6 py-2 font-display font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Iniciar sesión con Google
        </button>
      </CenteredCard>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">
            Baby Shower de {babyShowerEvent.babyName}
          </h1>
          <p className="text-sm text-foreground/70">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Actualizando…" : "Actualizar"}
          </button>
          <button
            type="button"
            onClick={() => signOutAdmin()}
            className="rounded-full bg-surface px-4 py-1.5 text-sm font-semibold text-brand-dark shadow transition-colors hover:bg-accent-cream"
          >
            Salir
          </button>
        </div>
      </header>

      {error && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      {data && <DashboardContent data={data} />}
      {!data && loading && <p className="text-foreground/70">Cargando…</p>}
    </main>
  );
}

function DashboardContent({ data }: { data: DashboardData }) {
  const { guests, confirmations, claims, gifts } = data;

  const confirmedIds = new Set(confirmations.map((c) => c.guestId));
  const pendingGuests = guests.filter((g) => !confirmedIds.has(g.id));
  const confirmedPeople = confirmations.reduce((sum, c) => sum + c.numGuests, 0);
  const invitedPeople = guests.reduce((sum, g) => sum + g.maxGuests, 0);
  const pendingPeople = pendingGuests.reduce((sum, g) => sum + g.maxGuests, 0);

  const claimedByGift = new Map<string, number>();
  for (const claim of claims) {
    claimedByGift.set(
      claim.giftId,
      (claimedByGift.get(claim.giftId) ?? 0) + claim.quantity
    );
  }
  const missingGifts = gifts.filter((g) => g.stock > 0);
  const missingUnits = missingGifts.reduce((sum, g) => sum + g.stock, 0);

  const sortedConfirmations = [...confirmations].sort((a, b) =>
    b.confirmedAt.localeCompare(a.confirmedAt)
  );
  const claimsByGuest = new Map<string, typeof claims>();
  for (const claim of claims) {
    claimsByGuest.set(claim.guestId, [
      ...(claimsByGuest.get(claim.guestId) ?? []),
      claim,
    ]);
  }

  return (
    <>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Personas confirmadas"
          value={confirmedPeople}
          detail={`de ${invitedPeople} cupos`}
        />
        <StatTile
          label="Invitaciones confirmadas"
          value={confirmations.length}
          detail={`de ${guests.length}`}
        />
        <StatTile
          label="Por confirmar"
          value={pendingGuests.length}
          detail={`${pendingPeople} cupos`}
        />
        <StatTile
          label="Regalos faltantes"
          value={missingGifts.length}
          detail={`${missingUnits} unidades`}
        />
      </section>

      <ProgressBar
        label="Confirmación"
        value={confirmations.length}
        total={guests.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`Confirmados (${confirmations.length})`}>
          {sortedConfirmations.length === 0 ? (
            <Empty>Nadie ha confirmado todavía.</Empty>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {sortedConfirmations.map((c) => (
                <li key={c.guestId} className="flex justify-between gap-3 py-2">
                  <span className="font-semibold">{c.name}</span>
                  <span className="shrink-0 text-sm text-foreground/70">
                    {c.numGuests} {c.numGuests === 1 ? "persona" : "personas"} ·{" "}
                    {formatDate(c.confirmedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`Faltan por confirmar (${pendingGuests.length})`}>
          {pendingGuests.length === 0 ? (
            <Empty>¡Todos confirmaron! 🎉</Empty>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {pendingGuests.map((g) => (
                <li key={g.id} className="flex justify-between gap-3 py-2">
                  <span className="font-semibold">{g.name}</span>
                  <span className="shrink-0 text-sm text-foreground/70">
                    {g.maxGuests} {g.maxGuests === 1 ? "cupo" : "cupos"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`Quién escogió qué regalo (${claimsByGuest.size})`}>
          {claimsByGuest.size === 0 ? (
            <Empty>Nadie ha escogido regalos todavía.</Empty>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {[...claimsByGuest.values()].map((guestClaims) => (
                <li key={guestClaims[0].guestId} className="py-2">
                  <p className="font-semibold">{guestClaims[0].name}</p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {guestClaims.map((claim) => (
                      <li
                        key={claim.giftId}
                        className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand-dark"
                      >
                        {claim.giftName}
                        {claim.quantity > 1 && ` ×${claim.quantity}`}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`Regalos faltantes (${missingGifts.length})`}>
          {missingGifts.length === 0 ? (
            <Empty>¡Ya se escogieron todos los regalos! 🎁</Empty>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {missingGifts.map((gift) => {
                const claimed = claimedByGift.get(gift.id) ?? 0;
                return (
                  <li key={gift.id} className="py-2">
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold">{gift.name}</span>
                      <span className="shrink-0 text-sm text-foreground/70">
                        faltan {gift.stock}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-foreground/60">
                        {gift.category}
                      </span>
                      <MiniBar value={claimed} total={claimed + gift.stock} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function StatTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
        {label}
      </p>
      <p className="font-display text-4xl font-bold text-brand-dark">{value}</p>
      <p className="text-sm text-foreground/70">{detail}</p>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-2xl bg-surface p-4 shadow">
      <div className="mb-2 flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="text-brand-dark">{pct}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-brand-light/30">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MiniBar({ value, total }: { value: number; total: number }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div
      className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light/30"
      title={`${value} de ${total} escogidos`}
    >
      <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow">
      <h2 className="mb-2 font-display text-lg font-bold text-brand-dark">{title}</h2>
      <div className="max-h-96 overflow-y-auto pr-1">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-2 text-sm text-foreground/60">{children}</p>;
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-surface p-8 text-center shadow-xl">
        {children}
      </div>
    </main>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}
