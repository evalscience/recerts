"use client";

import { Button } from "@/components/ui/button";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import useCopy from "@/hooks/use-copy";
import { ArrowUpRight, Check, Copy } from "lucide-react";
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

function sanitizeHttpUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	const trimmed = url.trim();
	if (trimmed.length === 0) return undefined;
	// Add protocol if missing but looks like a web URL
	const withProtocol = /^(https?:)?\/\//i.test(trimmed)
		? trimmed.startsWith("http")
			? trimmed
			: `https:${trimmed}`
		: trimmed.startsWith("www.")
		  ? `https://${trimmed}`
		  : trimmed;
	if (!/^https?:\/\//i.test(withProtocol)) return undefined;
	try {
		return encodeURI(withProtocol);
	} catch {
		return undefined;
	}
}

const AccessPaper: React.FC<{ hypercert: FullHypercert }> = ({ hypercert }) => {
	const [showBibtex, setShowBibtex] = React.useState(false);
	const { isCopied, copy } = useCopy();
	const paperUrlFromMetadata = hypercert.metadata.externalUrl;
	const fallbackUrlFromAttestations = React.useMemo(() => {
		for (const att of hypercert.attestations ?? []) {
			for (const src of att.data?.sources ?? []) {
				const url = src.src ?? "";
				if (typeof url === "string" && /^https?:\/\//i.test(url)) {
					return url;
				}
			}
		}
		return undefined;
	}, [hypercert]);
	const paperUrl =
		sanitizeHttpUrl(paperUrlFromMetadata) ??
		sanitizeHttpUrl(fallbackUrlFromAttestations);
	const paperHost = React.useMemo(() => {
		if (!paperUrl) return undefined;
		try {
			const host = new URL(paperUrl).hostname;
			return host.replace(/^www\./, "");
		} catch {
			return undefined;
		}
	}, [paperUrl]);

	const bibtex = React.useMemo(() => {
		const year = toYear(
			hypercert.metadata.work.from ?? hypercert.creationBlockTimestamp,
		);
		const title = hypercert.metadata.name ?? "Untitled";
		const authors = (hypercert.metadata.contributors ?? []).filter(Boolean);
		const idSuffix = hypercert.hypercertId.slice(-6);
		const authorLine = authors.length
			? `\n  author = {${authors.join(" and ")}},`
			: "";
		return `@misc{recert_${idSuffix}_${
			year ?? "nd"
		},\n  title = {${title}},${authorLine}\n  journal = {Recerts Journal},\n  year = {${
			year ?? ""
		}},\n  hypercert_id = {${hypercert.hypercertId}}\n}`;
	}, [hypercert]);

	// Optional: minimal debug log during development
	// console.log("[AccessPaper] paperUrl:", paperUrl);

	return (
		<SectionWrapper title="Access Paper">
			<div className="flex flex-wrap items-center justify-start gap-2">
				<Button
					className="gap-2"
					size="sm"
					variant="outline"
					disabled={!paperUrl}
					onClick={() => {
						if (paperUrl) {
							window.open(paperUrl, "_blank", "noopener,noreferrer");
						}
					}}
				>
					<span>Read paper</span>
					<ArrowUpRight size={14} />
				</Button>
				<Button
					className="gap-2"
					size="sm"
					variant="outline"
					onClick={() => setShowBibtex((v) => !v)}
				>
					<span>{showBibtex ? "Hide BibTeX" : "Export BibTeX"}</span>
				</Button>
				{showBibtex && (
					<Button
						className="gap-2"
						variant="outline"
						size="icon"
						aria-label="Copy BibTeX"
						onClick={() => copy(bibtex)}
					>
						{isCopied ? <Check size={16} /> : <Copy size={16} />}
					</Button>
				)}
			</div>
			{showBibtex && (
				<pre className="mt-3 w-full max-w-full whitespace-pre-wrap break-words rounded-md bg-muted p-3 font-mono text-sm">
					{bibtex}
				</pre>
			)}
		</SectionWrapper>
	);
};

export default AccessPaper;
