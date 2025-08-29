import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "A short history of mechanism design for public goods | Recerts",
	description:
		"Explore the timeline and evolution of public goods funding mechanisms and initiatives.",
};

export default function HistoryPage() {
	return (
		<div className="relative h-screen w-full">
			<iframe
				loading="lazy"
				style={{
					width: "100%",
					height: "100%",
					border: "none",
					backgroundColor: "black",
				}}
				src="https://www.canva.com/design/DAGxB3vptAI/3KRj8e0IkoY24glcd3xWlg/view?embed"
				allowFullScreen
				allow="fullscreen"
				title="Short History of Mechanism Design for Public Goods"
			/>
			<a
				href="/history.pdf"
				download
				className="absolute top-4 right-4 rounded-md bg-black/70 px-3 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-black/90"
			>
				Download PDF ↓
			</a>
		</div>
	);
}
