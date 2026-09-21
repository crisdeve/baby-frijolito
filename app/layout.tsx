import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import localFont from "next/font/local";
import CloudBackground from "@/components/CloudBackground";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Baby Shower de Frijolito",
  description: "Invitación al baby shower de Frijolito",
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
