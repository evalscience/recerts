import HeroSection from "./hero-section";
import HeroTitle from "./hero-title";
import { HypercertsGridWrapper } from "./components/hypercerts-grid-view";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export default async function Home() {
  return (
    <main className="flex flex-col gap-4 pb-[64px] md:pb-0">
      <section className="flex flex-col items-center gap-4 p-8">
        <div className="px-4 w-full flex flex-col items-center">
          <HeroSection />
        </div>
        <HeroTitle />
      </section>

      <MotionWrapper
        type="section"
        className="w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Suspense
          fallback={
            <section className="flex w-full flex-col items-center gap-4 pt-6 pb-24 md:pb-6">
              <Loader2 className="animate-spin text-primary" size={40} />
              <span className="text-muted-foreground">
                Loading hypercerts...
              </span>
            </section>
          }
        >
          <HypercertsGridWrapper />
        </Suspense>
      </MotionWrapper>
    </main>
  );
}
