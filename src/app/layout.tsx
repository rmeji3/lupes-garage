import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lupesgaragedoors.com"), // Placeholder URL, replace with actual if known
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
    "garage door spring repair",
    "garage door opener installation",
    "Berwyn",
    "Oak Park"
  ],
  authors: [{ name: "Lupe's Garage Doors" }],
  creator: "Lupe's Garage Doors",
  publisher: "Lupe's Garage Doors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-US": "/es",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png", // Recommended for iOS
  },
  openGraph: {
    title: "Lupe's Garage Doors | Cicero & Chicago, IL",
    description:
      "Family-owned garage door installation and repair. Free estimates. English y Español. Serving Cicero, Chicago, and the western suburbs.",
    url: "https://lupesgaragedoors.com",
    siteName: "Lupe's Garage Doors",
    locale: "en_US",
    alternateLocale: "es_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Add an og-image.jpg to public folder for best results
        width: 1200,
        height: 630,
        alt: "Lupe's Garage Doors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lupe's Garage Doors | Cicero & Chicago, IL",
    description: "Family-owned garage door installation and repair. Free estimates.",
    creator: "@lupesgarage", // Replace with actual handle if they have one
    images: ["/og-image.jpg"],
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
