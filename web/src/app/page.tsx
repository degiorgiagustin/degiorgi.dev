import { Contact } from "@/components/contact/Contact";
import { Hero } from "@/components/hero/Hero";
import { Timeline } from "@/components/journey/Timeline";
import { Work } from "@/components/work/Work";
import { Stack } from "@/components/stack/Stack";
import { DockMount } from "@/components/console/DockMount";

// Home — composes the single-page sections top to bottom (spec 002 §4).
// The dock is a fixed overlay outside the section flow (spec 003 §3);
// Contact's bottom padding reserves its clearance.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Timeline />
      <Work />
      <Stack />
      <Contact />
      <DockMount />
    </main>
  );
}
