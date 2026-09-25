import type { Metadata } from "next";
import { DoorStylePicker } from "@/components/DoorStylePicker";

export const metadata: Metadata = {
  title: "Door Styles | Lupe's Garage Doors",
  description:
    "Browse and compare garage door styles installed by Lupe's Garage Doors in Cicero and Chicago: carriage house, raised panel, windowed steel, flush, and openers.",
  alternates: { canonical: "/styles" },
};

export default function StylesPage() {
  return <DoorStylePicker />;
}
