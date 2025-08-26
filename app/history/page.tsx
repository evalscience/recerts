import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "A short history of mechanism design for public goods | Recerts",
	description:
		"Explore the timeline and evolution of public goods funding mechanisms and initiatives.",
};

export default function HistoryPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex-1 p-6 md:p-12">
				<div className="mx-auto max-w-7xl">
					<h1 className="mb-12 text-center font-light text-2xl text-neutral-800 dark:text-neutral-200">
						A short history of MD4PG
					</h1>

					<div className="relative">
						<div
							className="overflow-auto border border-neutral-200 dark:border-neutral-700"
							style={{
								height: "calc(100vh - 200px)",
								borderRadius: "2px",
							}}
						>
							<iframe
								loading="lazy"
								style={{
									width: "100%",
									height: "100%",
									border: "none",
								}}
								src="https://www.canva.com/design/DAGxB3vptAI/3KRj8e0IkoY24glcd3xWlg/view?embed"
								allowFullScreen
								allow="fullscreen"
								title="Short History of Mechanism Design for Public Goods"
							/>
						</div>

						<div className="mt-6 text-center">
							<a
								href="https://www.canva.com/design/DAGxB3vptAI/3KRj8e0IkoY24glcd3xWlg/view?utm_content=DAGxB3vptAI&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
								target="_blank"
								rel="noopener noreferrer"
								className="text-neutral-500 text-sm transition-colors dark:hover:text-neutral-300 dark:text-neutral-400 hover:text-neutral-700"
							>
								View full timeline ↗
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
