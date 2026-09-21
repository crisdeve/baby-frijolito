import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// App Check needs a browser (it injects the reCAPTCHA script), and this
// module is also evaluated while the client component tree is prerendered
// to static HTML at build time, so it must stay behind a `window` guard.
if (typeof window !== "undefined") {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (process.env.NODE_ENV === "development") {
    // Lets `next dev` run against Firebase without a real reCAPTCHA pass.
    // Register the token Firebase logs on first run in the App Check
    // console (Apps > this app > Manage debug tokens).
    (
      window as typeof window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }
    ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  if (siteKey) {
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else if (process.env.NODE_ENV !== "development") {
    console.warn(
      "NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. Firebase App Check (bot protection) is disabled."
    );
  }
}

export const db = getFirestore(firebaseApp);
