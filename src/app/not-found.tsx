import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { NotFoundContent } from "@/components/NotFoundContent";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found | Lupe's Garage Doors",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
