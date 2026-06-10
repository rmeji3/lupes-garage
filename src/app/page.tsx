import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { WhyUs } from "@/components/WhyUs";
import { ServiceArea } from "@/components/ServiceArea";
import { QuoteSection } from "@/components/QuoteSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
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
