import { Hero } from "@/components/sections/hero";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { Services } from "@/components/sections/services";
import { Results } from "@/components/sections/results";
import { Testimonials } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <ProblemSolution />
        <Services />
        <Results />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
