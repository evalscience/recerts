import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { HypercertsGridWrapper } from "./components/hypercerts-grid-view";
import HeroSection from "./hero-section";
import HeroTitle from "./hero-title";

export default async function Home() {
	return (
		<main className="flex flex-col gap-4 pb-[64px] md:pb-0">
			<section className="flex flex-col items-center gap-4 p-8">
				<div className="flex w-full flex-col items-center px-4">
					<HeroSection />
				</div>
				<HeroTitle />
			</section>

			<MotionWrapper
				type="section"
				className="flex w-full flex-col items-center"
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<Suspense
					fallback={
						<section className="flex w-full flex-col items-center gap-4 pt-6 pb-24 md:pb-6">
							<Loader2 className="animate-spin text-primary" size={40} />
							<span className="text-muted-foreground">
								Please wait while we load hypercerts...
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
