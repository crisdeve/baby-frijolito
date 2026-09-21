# Baby Shower de Frijolito

Invitación estática (Next.js `output: 'export'`) para GitHub Pages, con lista de
regalos cuya disponibilidad vive en Firestore.

- Invitados y catálogo de regalos: `data/guests.json` y `data/gifts.json`.
- Cada invitado tiene un link personal: `/i/<id-del-invitado>`.
- La disponibilidad de cada regalo se lee de Firestore (colección `gifts`,
  un solo `getDocs`) y se combina con la info del JSON (nombre/imagen/descr.).
- Al confirmar, una transacción de Firestore descuenta 1 unidad de stock y
  guarda la confirmación en la colección `confirmaciones`.
- Protección contra bots: [Firebase App Check](https://firebase.google.com/docs/app-check)
  con reCAPTCHA v3, exigido por las reglas de seguridad de Firestore — no hace
  falta backend propio.

## Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   y dentro de él una base de datos **Firestore** (modo producción).
2. Registra una app web y copia sus credenciales al archivo **`.env`**
   (ya está en el repo con placeholders `REPLACE_ME` — reemplázalos). Estos
   valores son públicos por diseño (la seguridad la dan las Firestore Rules y
   App Check, no ocultar el `apiKey`), por eso el archivo sí se commitea; así
   tanto `next dev` como el deploy a GitHub Pages funcionan con solo
   `git push`, sin configurar secrets.
3. En **App Check**, registra la app con el proveedor **reCAPTCHA v3**, copia
   el *site key* a `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` en `.env`, y activa
   **Enforce** para Cloud Firestore (App Check > APIs).
4. Instala el [Firebase CLI](https://firebase.google.com/docs/cli) y despliega
   las reglas de seguridad (`firestore.rules`):

   ```bash
   firebase login
   firebase deploy --only firestore:rules --project <tu-project-id>
   ```

5. Inicializa el stock de regalos con el script de seed (usa el Admin SDK, así
   que no pasa por las reglas). Descarga una *service account key* JSON desde
   Project settings > Service accounts, y edita `STOCK_BY_ID` en
   `scripts/seed-gifts.mjs` con las cantidades reales:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json pnpm seed:gifts
   ```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). No hace falta crear un
`.env.local`: el `.env` del repo ya se carga tanto en `next dev` como en
`next build` (a diferencia de `.env.production`, que Next.js solo lee al
hacer build). Solo crea `.env.local` si algún día quieres apuntar el
desarrollo local a un proyecto de Firebase distinto al de producción — ver
`.env.example`.

En desarrollo, App Check usa un *debug token*: la consola del navegador
mostrará el token la primera vez — regístralo en Firebase Console >
App Check > Apps > ⋮ > Manage debug tokens para que las escrituras a
Firestore funcionen en `next dev`.

Para probar un invitado, visita `/i/ana-lopez` (o cualquier id de
`data/guests.json`).

## Despliegue en GitHub Pages

El workflow en `.github/workflows/deploy.yml` construye el sitio (`next build`
con `output: 'export'`, leyendo `.env`) y lo publica en GitHub Pages en cada
push a `main`. No necesitas configurar secrets: solo llena `.env` con tus
valores reales de Firebase y haz commit.

1. En el repo, ve a **Settings > Pages** y pon **Source: GitHub Actions**.
2. Si el sitio se sirve como `https://<usuario>.github.io/<repo>` (project
   site), el workflow ya calcula el `basePath` a partir del nombre del repo.
   Si usas un dominio propio o un *user/org site*
   (`https://<usuario>.github.io`), quita esa línea `NEXT_PUBLIC_BASE_PATH`
   del workflow.

Para generar el export localmente:

```bash
pnpm build
# sitio estático listo en ./out
```
