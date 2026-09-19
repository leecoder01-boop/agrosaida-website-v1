import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const display = Sora({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGROSAIDA — Da terra nasce o futuro",
  description:
    "Experiência, proximidade e inovação para impulsionar cada novo ciclo do agronegócio.",
  openGraph: {
    title: "AGROSAIDA — Da terra nasce o futuro",
    description:
      "Experiência, proximidade e inovação para impulsionar cada novo ciclo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}