"use client";

import type { EcocertAttestation } from "@/app/graphql-queries/hypercerts";
import EthAvatar from "@/components/ui/eth-avatar";
import UserChip from "@/components/user-chip";
import autoAnimate from "@formkit/auto-animate";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useMemo, useRef, useState } from "react";
import AttestationFilters from "./AttestationFilters";
import URLSource from "./URLSource";

dayjs.extend(relativeTime);

type SortOption = "newest" | "oldest";

export default function AttestationsList({
	attestations,
	creatorAddress,
}: {
	attestations: EcocertAttestation[];
	creatorAddress: `0x${string}`;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [showCreatorOnly, setShowCreatorOnly] = useState(false);

	const listRef = useRef<HTMLDivElement>(null);

	const filteredAndSortedAttestations = useMemo(() => {
		// First filter the attestations based on search query
		const filtered = attestations.filter((attestation) => {
			if (
				showCreatorOnly &&
				attestation.attester.toLowerCase() !== creatorAddress.toLowerCase()
			) {
				return false;
			}
			if (!searchQuery) return true;

			const searchLower = searchQuery.toLowerCase();
			const title = attestation.data.title.toLowerCase();
			const description = attestation.data.description.toLowerCase();
			const attester = attestation.attester.toLowerCase();

			return (
				title.includes(searchLower) ||
				description.includes(searchLower) ||
				attester.includes(searchLower)
			);
		});

		// Then sort the filtered results
		return [...filtered].sort((a, b) => {
			const timestampA = Number(a.creationBlockTimestamp);
			const timestampB = Number(b.creationBlockTimestamp);
			return sortBy === "newest"
				? timestampB - timestampA
				: timestampA - timestampB;
		});
	}, [attestations, searchQuery, sortBy, showCreatorOnly, creatorAddress]);

	// biome-ignore lint/correctness/useExhaustiveDependencies(filteredAndSortedAttestations.length): Apply autoanimate each time the list is empty / unempty
	useEffect(() => {
		if (listRef.current) {
			autoAnimate(listRef.current);
		}
	}, [filteredAndSortedAttestations.length === 0]);

	return (
		<>
			<AttestationFilters
				onSearch={setSearchQuery}
				onSort={setSortBy}
				onCreatorOnlyChange={setShowCreatorOnly}
			/>
			<div className="mt-4 flex flex-col gap-2" ref={listRef}>
				{filteredAndSortedAttestations.map((attestation) => {
					const creationDateFromNow = dayjs(
						Number(attestation.creationBlockTimestamp) * 1000,
					).fromNow();
					const urlSources = attestation.data.sources.filter(
						(source) => source.type === "url",
					);

					return (
						<div
							key={attestation.uid}
							className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 md:flex-row"
						>
							<div className="flex flex-1 flex-col gap-4">
								<div className="flex items-center gap-2">
									<EthAvatar
										address={attestation.attester as `0x${string}`}
										size={36}
									/>
									<div className="flex flex-col">
										<UserChip
											address={attestation.attester as `0x${string}`}
											className="border-none bg-transparent p-0 font-bold text-sm"
											showCopyButton="hover"
											showAvatar={false}
										/>
										<span className="text-muted-foreground text-xs">
											{creationDateFromNow}
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="font-bold">{attestation.data.title}</h3>
									<p className="text-muted-foreground">
										{attestation.data.description}
									</p>
								</div>
							</div>
							{urlSources.length > 0 && (
								<div className="flex flex-col gap-2 md:w-1/2">
									<span className="font-bold text-muted-foreground text-xs">
										Attached Links
									</span>
									<div className="flex flex-col divide-y overflow-hidden rounded-md border border-border bg-white">
										{urlSources.map((urlSource, index) => {
											const key = `${urlSource.src}-${index}`;
											return <URLSource key={key} url={urlSource.src} />;
										})}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
}
