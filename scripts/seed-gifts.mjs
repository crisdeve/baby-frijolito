// One-off script to (re)initialize the `gifts` stock collection in Firestore
// from data/gifts.json, using the Firebase Admin SDK (bypasses security rules).
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node scripts/seed-gifts.mjs
//
// Edit STOCK_BY_ID below to set how many units of each gift are available.

import { readFile } from "node:fs/promises";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const STOCK_BY_ID = {
  "colecho-colchon": 1,
  "banera-cambiador": 1,
  "mecedora-bebe": 1,
  "protector-colecho": 1,
  "sabana-colecho": 1,
  sleeping: 2,
  "gimnasio-piso": 1,
  fular: 1,
  coche: 1,
  "cojin-amamantar": 1,
  "toalla-capucha": 5,
  "panales-recien-nacido": 5,
  "panales-etapa-1": 5,
  "panales-etapa-2": 10,
  "panales-etapa-3": 10,
  "panales-etapa-4": 10,
  "panitos-humedos": 20,
  "crema-panalera": 2,
  "crema-hidratante": 5,
  "kit-unas": 1,
  muselinas: 10,
  "bodies-manga-larga": 6,
  "gorros-algodon": 5,
  "calcetines-algodon": 10,
  "ropa-3-6-meses": 5,
  termometro: 1,
  "aspirador-nasal": 1,
  esterilizador: 1,
  "jabon-esterilizador": 1,
  botiquin: 1,
};

const gifts = JSON.parse(
  await readFile(new URL("../data/gifts.json", import.meta.url))
);

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const batch = db.batch();
for (const gift of gifts) {
  const stock = STOCK_BY_ID[gift.id];
  if (stock === undefined) {
    console.warn(`No stock defined for "${gift.id}", skipping.`);
    continue;
  }
  batch.set(db.collection("gifts").doc(gift.id), { stock });
}

await batch.commit();
console.log(`Seeded stock for ${Object.keys(STOCK_BY_ID).length} gifts.`);
