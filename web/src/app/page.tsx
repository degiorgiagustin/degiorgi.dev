import { Contact } from "@/components/contact/Contact";
import { Hero } from "@/components/hero/Hero";
import { Timeline } from "@/components/journey/Timeline";
import { Work } from "@/components/work/Work";
import { Stack } from "@/components/stack/Stack";

// Home — composes the single-page sections top to bottom (spec 002 §4).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Timeline />
      <Work />
      <Stack />
      <Contact />
    </main>
  );
}
