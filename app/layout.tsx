import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import localFont from "next/font/local";
import CloudBackground from "@/components/CloudBackground";
import { babyShowerEvent } from "@/lib/event";
import "./globals.css";

// Absolute site origin (incl. GitHub Pages basePath), needed to resolve the
// og:image below into a full URL — link-preview scrapers (WhatsApp, etc.)
// don't fetch relative paths.
const siteUrl = `https://crisdeve.github.io${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const playwrite = localFont({
  src: "../public/fonts/PlaywriteBEWAL-VariableFont_wght.ttf",
  variable: "--font-script",
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const title = `Baby Shower de ${babyShowerEvent.babyName}`;
const description = `Invitación al baby shower de ${babyShowerEvent.babyName}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    // No leading slash: with metadataBase set to ".../baby-frijolito/", a
    // leading "/" would resolve against the domain root and drop the
    // basePath segment, breaking the image URL under GitHub Pages.
    images: ["baby-welcome.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${baloo.variable} ${playwrite.variable} ${nunito.variable} h-full`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden antialiased">
        <CloudBackground />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
