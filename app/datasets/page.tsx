import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import datasetsData from "./datasets.json";

export const metadata: Metadata = {
	title: "Datasets | MD4PG — Recerts",
	description:
		"Available datasets for mechanism design and public goods research.",
};

interface Dataset {
	title: string;
	description: string;
	url?: string;
	format: string;
	size?: string;
	provider: string;
	tags: string[];
	challenges?: string[];
}

export default function DatasetsPage() {
	const datasets: Dataset[] = datasetsData;

	return (
		<main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-20">
			<header className="mb-16 text-center">
				<h1 className="mb-4 font-bold text-4xl text-foreground md:text-5xl">
					Datasets
				</h1>
				<p className="text-lg text-muted-foreground">
					Research datasets for mechanism design and public goods
				</p>
			</header>

			<div className="space-y-8">
				{datasets.map((dataset) => (
					<article
						key={dataset.title}
						className="border-border border-b pb-8 last:border-b-0"
					>
						<div className="mb-3 flex items-start justify-between">
							<div>
								<h2 className="font-semibold text-foreground text-xl">
									{dataset.title}
								</h2>
								<p className="mt-1 text-muted-foreground text-sm">
									Provided by {dataset.provider}
								</p>
							</div>
							{dataset.url && (
								<Link
									href={dataset.url}
									className="ml-4 shrink-0 font-medium text-primary text-sm hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									Download
								</Link>
							)}
						</div>

						<p className="mb-4 text-muted-foreground leading-relaxed">
							{dataset.description}
						</p>

						{dataset.challenges && dataset.challenges.length > 0 && (
							<div className="mb-6">
								<h3 className="mb-4 font-medium text-foreground text-sm">
									Curated Research Challenges
								</h3>
								<div className="grid gap-2 text-muted-foreground text-sm">
									{dataset.challenges.map((challenge) => (
										<div
											key={challenge}
											className="border-muted border-l-2 py-1.5 pl-3 leading-relaxed"
										>
											{challenge}
										</div>
									))}
								</div>
							</div>
						)}

						<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
							<span>{dataset.format}</span>
							{dataset.size && <span>{dataset.size}</span>}
							<div className="flex flex-wrap gap-2">
								{dataset.tags.map((tag) => (
									<span
										key={tag}
										className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</article>
				))}

				{datasets.length === 0 && (
					<div className="py-16 text-center">
						<p className="text-muted-foreground">No datasets available yet.</p>
					</div>
				)}
			</div>
		</main>
	);
}
