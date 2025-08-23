import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import React from "react";
import MarkdownPreview from "./_components/MarkdownPreview";
import changelogBlocks from "./data";

const Page = () => {
	const getMarkdownContentFromSource = (source: string) => {
		if (source.startsWith("!")) {
			const fileName = source.slice(1);
			const filePath = path.join(
				process.cwd(),
				"app",
				"changelog",
				"sources",
				fileName,
			);
			return readFileSync(filePath, "utf-8");
		}
		return null;
	};

	return (
		<main className="mx-auto w-full max-w-2xl px-6 py-20">
			<header className="mb-20 text-center">
				<h1 className="mb-6 font-light text-5xl text-foreground tracking-tight">
					Changelog
				</h1>
			</header>

			<div className="space-y-16">
				{changelogBlocks.map((block) => {
					const content = getMarkdownContentFromSource(block.contentSource);
					if (!content) {
						return null;
					}
					return (
						<article key={block.title}>
							<header className="mb-8">
								<h2 className="mb-2 font-medium text-foreground text-xl">
									{block.title}
								</h2>
								<p className="text-muted-foreground/70 text-sm">{block.date}</p>
							</header>

							<div className="prose prose-sm prose-neutral dark:prose-invert max-w-none prose-headings:font-medium prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-p:leading-relaxed">
								<MarkdownPreview markdown={content} />
							</div>
						</article>
					);
				})}
			</div>
		</main>
	);
};

export default Page;
