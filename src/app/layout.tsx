import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lupe's Garage Doors | Garage Door Installation in Cicero & Chicago, IL",
  description:
    "Family-owned garage door installation, replacement, and repair serving Cicero, Chicago, and nearby suburbs. Free estimates, honest prices, service in English y Español.",
  keywords: [
    "garage door installation",
    "garage door repair",
    "Cicero IL",
    "Chicago",
    "puertas de garaje",
    "instalación de puertas de garaje",
  ],
  openGraph: {
    title: "Lupe's Garage Doors | Garage Door Installation in Cicero & Chicago, IL",
    description:
      "Family-owned garage door installation and repair. Free estimates. English y Español.",
    locale: "en_US",
    alternateLocale: "es_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
