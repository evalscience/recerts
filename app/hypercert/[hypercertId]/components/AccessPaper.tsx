"use client";

import { Button } from "@/components/ui/button";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { ArrowUpRight, FileText, LibraryBig } from "lucide-react";
import React from "react";
import SectionWrapper from "./SectionWrapper";

function toYear(timestamp: bigint | number | undefined): number | undefined {
	if (timestamp === undefined) return undefined;
	const ms =
		typeof timestamp === "bigint"
			? Number(timestamp) * 1000
			: Number(timestamp) * 1000;
	if (!Number.isFinite(ms)) return undefined;
	return new Date(ms).getUTCFullYear();
}

function buildBibTeX(hypercert: FullHypercert, pdfUrl?: string): string {
	const title = hypercert.metadata.name ?? "Untitled";
	const authors = (hypercert.metadata.contributors ?? []).join(" and ");
	const year = toYear(hypercert.creationBlockTimestamp);
	const keyBase = title.replace(/[^a-z0-9]+/gi, "").toLowerCase();
	const key = `${keyBase || "hypercert"}${year ?? ""}`;
	const fields: Record<string, string | undefined> = {
		title,
		author: authors || undefined,
		year: year ? String(year) : undefined,
		howpublished: pdfUrl ? `\\url{${pdfUrl}}` : undefined,
		note: `Hypercert ID: ${hypercert.hypercertId}`,
	};
	const body = Object.entries(fields)
		.filter(([, v]) => v !== undefined && v !== "")
		.map(([k, v]) => `  ${k} = {${v}}`)
		.join(",\n");
	return `@misc{${key},\n${body}\n}`;
}

function extractPdfUrl(hypercert: FullHypercert): string | undefined {
	for (const att of hypercert.attestations ?? []) {
		for (const src of att.data?.sources ?? []) {
			const url = src.src ?? "";
			if (typeof url === "string" && /\.pdf(\?.*)?$/i.test(url)) {
				return url;
			}
		}
	}
	return undefined;
}

const AccessPaper: React.FC<{ hypercert: FullHypercert }> = ({ hypercert }) => {
	const pdfUrl = React.useMemo(() => extractPdfUrl(hypercert), [hypercert]);

	const handleCopyBibTex = React.useCallback(() => {
		const bib = buildBibTeX(hypercert, pdfUrl);
		void navigator.clipboard.writeText(bib);
	}, [hypercert, pdfUrl]);

	return (
		<SectionWrapper title="Access Paper">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-muted-foreground text-xs">
					{pdfUrl
						? "View or cite the associated paper."
						: "No PDF found in supplementary material."}
				</div>
				<div className="flex items-center gap-2">
					<Button
						asChild
						variant="outline"
						size="sm"
						disabled={!pdfUrl}
						className="gap-2"
					>
						<a
							href={pdfUrl ?? "#"}
							target={pdfUrl ? "_blank" : undefined}
							rel="noreferrer"
						>
							<FileText size={14} />
							<span>View PDF</span>
							{pdfUrl ? <ArrowUpRight size={14} /> : null}
						</a>
					</Button>
					<Button
						variant="secondary"
						size="sm"
						className="gap-2"
						onClick={handleCopyBibTex}
					>
						<LibraryBig size={14} />
						<span>Export as BibTeX</span>
					</Button>
				</div>
			</div>
		</SectionWrapper>
	);
};

export default AccessPaper;
