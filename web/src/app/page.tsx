import { Hero } from "@/components/hero/Hero";
import { Timeline } from "@/components/journey/Timeline";

// Home — composes the single-page sections top to bottom (spec 002 §4).
// Work / Stack / Contact arrive in later phases.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Timeline />
    </main>
  );
}
