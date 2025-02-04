import { TriangleAlert } from "lucide-react";
import { HypercertForm } from "./components/hypercert-form";

function SubmitPage() {
	return (
		<main className="container mt-2 flex max-w-6xl flex-col gap-4 pb-[64px] md:mt-8 md:pb-12">
			{/* <main className="container grid max-w-screen-lg auto-rows-auto grid-cols-1 flex-col gap-4 p-4 pb-24 text-vd-blue-900 md:grid-cols-3 md:px-6 md:py-8"> */}
			{/* <section className="flex flex-col items-center p-4 md:p-8 gap-4"> */}
			<header className="flex w-full flex-col gap-2 py-4">
				<h1 className="text-balance font-baskerville font-bold text-4xl md:text-5xl">
					Create an ecocert
				</h1>
				<p className="text-beige-muted-foreground">
					An ecocert is a verifiable record of your environmental work. Share
					its impact with the world.
				</p>
			</header>
			<section>
				<HypercertForm />
			</section>
		</main>
	);
}

export default SubmitPage;
