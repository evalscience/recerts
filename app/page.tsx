import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import HeroSection from "./components/hero-section";
import HeroTitle from "./components/hero-title";
import { HypercertsGridWrapper } from "./components/hypercerts-grid-view";
import PageError from "./components/shared/PageError";

export default async function Home() {
	return (
		<main className="flex flex-col gap-4 pb-[64px] md:pb-0">
			<section className="flex flex-col items-center gap-4 p-8">
				<div className="flex w-full flex-col items-center px-4">
					<HeroSection />
				</div>
			</section>

			<MotionWrapper
				type="section"
				className="flex w-full flex-col items-center"
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<ErrorBoundary
					fallback={<PageError title="We couldn't load ecocerts." />}
				>
					<Suspense
						fallback={
							<section className="flex w-full flex-col items-center gap-4 pt-6 pb-24 md:pb-6">
								<Loader2 className="animate-spin text-primary" size={40} />
								<span className="text-muted-foreground">
									Please wait while we load our favorite ecocerts...
								</span>
							</section>
						}
					>
						<HypercertsGridWrapper />
					</Suspense>
				</ErrorBoundary>
			</MotionWrapper>
		</main>
	);
}
