"use client";

import AddAttestationDialog from "@/app/components/add-attestation-dialog";
import useFullHypercert from "@/app/contexts/full-hypercert";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import UserChip from "@/components/user-chip";
import { EAS_CONFIGS } from "@/config/eas";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link2, LinkIcon, PlusCircle } from "lucide-react";
import React from "react";
import SectionWrapper from "../SectionWrapper";
import URLSourcePreviewDialog from "./URLSourcePreviewDialog";

dayjs.extend(relativeTime);

const Attestations = () => {
	const hypercert = useFullHypercert();
	const attestations = hypercert.attestations;
	const validAttestations = attestations;
	//   const validAttestations = attestations.filter((attestation) =>
	//     Boolean(EAS_CONFIGS.find((eas) => eas.schemaUID === attestation.schema_uid))
	//   );

	return (
		<SectionWrapper title="Attestations">
			<div className="flex flex-col items-center gap-4">
				<div className="flex w-full flex-col gap-2">
					{validAttestations.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 rounded-md bg-muted p-4 font-sans">
							<p className="text-muted-foreground text-sm">
								No attestations found
							</p>
						</div>
					) : (
						validAttestations.slice(0, 2).map((attestation) => {
							const creationDateFromNow = dayjs(
								Number(attestation.creationBlockTimestamp) * 1000,
							).fromNow();
							const urlSources = attestation.data.sources.filter(
								(source) => source.type === "url",
							);
							return (
								<div
									className="flex flex-col gap-4 rounded-lg bg-accent p-4 font-sans"
									key={attestation.uid}
								>
									<div className="flex items-center gap-2">
										<EthAvatar
											address={attestation.attester as `0x${string}`}
											size={36}
										/>
										<div className="flex flex-col">
											<UserChip
												address={attestation.attester as `0x${string}`}
												className="border-none p-0 font-bold text-sm"
												showCopyButton="hover"
												showAvatar={false}
											/>

											<span className="text-muted-foreground text-xs">
												{creationDateFromNow}
											</span>
										</div>
									</div>
									<p className="">{attestation.data.description}</p>
									<div className="flex flex-col gap-1">
										<span className="font-bold font-sans text-muted-foreground text-xs">
											Attached Files
										</span>
										<div className="flex items-center">
											<div className="flex gap-2">
												<URLSourcePreviewDialog
													urls={urlSources.map((source) => source.src)}
													triggers={urlSources.map((_, index) => (
														<Button
															key={`${attestation.uid}-${index}`}
															variant="outline"
															className="flex h-10 w-10 items-center justify-center p-0"
														>
															<LinkIcon size={16} />
														</Button>
													))}
												/>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
				<div
					className={cn(
						"flex w-full items-center justify-center",
						validAttestations.length > 2 && "justify-between",
					)}
				>
					<AddAttestationDialog
						trigger={
							<Button variant="outline" className="gap-2" size={"sm"}>
								<PlusCircle size={16} />
								Add Attestation
							</Button>
						}
						hypercertId={hypercert.hypercertId}
					/>
					{validAttestations.length > 2 && (
						<Button variant={"ghost"} size={"sm"}>
							View all
						</Button>
					)}
				</div>
			</div>
		</SectionWrapper>
	);
};

export default Attestations;
