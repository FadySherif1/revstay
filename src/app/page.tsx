import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";

const PlatformsCarousel = dynamic(() =>
  import("@/components/sections/platforms-carousel").then(
    (m) => m.PlatformsCarousel
  )
);
const ProblemSolution = dynamic(() =>
  import("@/components/sections/problem-solution").then((m) => m.ProblemSolution)
);
const ScrollScene = dynamic(() =>
  import("@/components/ui/scroll-scene").then((m) => m.ScrollScene)
);
const Services = dynamic(() =>
  import("@/components/sections/services").then((m) => m.Services)
);
const Results = dynamic(() =>
  import("@/components/sections/results").then((m) => m.Results)
);
const About = dynamic(() =>
  import("@/components/sections/about").then((m) => m.About)
);
const FinalCta = dynamic(() =>
  import("@/components/sections/final-cta").then((m) => m.FinalCta)
);
const Footer = dynamic(() =>
  import("@/components/sections/footer").then((m) => m.Footer)
);

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <PlatformsCarousel />
        <ProblemSolution />
        <ScrollScene />
        <Services />
        <Results />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
