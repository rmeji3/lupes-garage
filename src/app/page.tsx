import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { WhyUs } from "@/components/WhyUs";
import { ServiceArea } from "@/components/ServiceArea";
import { QuoteSection } from "@/components/QuoteSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Lupe's Garage Doors",
    image: "https://lupesgaragedoors.com/og-image.jpg",
    "@id": "https://lupesgaragedoors.com",
    url: "https://lupesgaragedoors.com",
    telephone: "+17085950374",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "Cicero",
      addressRegion: "IL",
      postalCode: "60804",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.8456,
      longitude: -87.7539,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        opens: "07:00",
        closes: "19:00"
      }
    ],
    sameAs: []
  };

  return (
    <>
      {/* Add JSON-LD to the head using script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <WhyUs />
        <ServiceArea />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
