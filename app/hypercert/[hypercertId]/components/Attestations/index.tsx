"use client";

import AddAttestationDialog from "@/app/components/add-attestation-dialog";
import useFullHypercert from "@/app/contexts/full-hypercert";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import QuickTooltip from "@/components/ui/quicktooltip";
import UserChip from "@/components/user-chip";
import { EAS_CONFIGS } from "@/config/eas";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Copy, Eye, Globe, Link2, LinkIcon, PlusCircle } from "lucide-react";
import React from "react";
import SectionWrapper from "../SectionWrapper";
import URLSourcePreviewDialog from "./URLSourcePreviewDialog";

dayjs.extend(relativeTime);

const Attestations = () => {
	const hypercert = useFullHypercert();
	const attestations = hypercert.attestations;
	const sortedAttestations = attestations.sort(
		(a, b) =>
			Number(b.creationBlockTimestamp) - Number(a.creationBlockTimestamp),
	);
	const validAttestations = sortedAttestations;
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
									{urlSources.length > 0 && (
										<div className="flex flex-col gap-1">
											<span className="font-bold font-sans text-muted-foreground text-xs">
												Attached Links
											</span>
											<div className="flex flex-col gap-1">
												<URLSourcePreviewDialog
													urls={urlSources.map((source) => source.src)}
													TriggerRenderer={({
														wrapper: Wrapper,
														setActiveIndex,
													}) => {
														return (
															<>
																{urlSources
																	.slice(0, 2)
																	.map((urlSource, index) => {
																		return (
																			<div className="rounded-md border border-border bg-background">
																				<div
																					key={`${attestation.uid}-${index}`}
																					className="flex w-full items-center justify-start gap-2 p-2"
																				>
																					<div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
																						<LinkIcon
																							className="text-primary"
																							size={16}
																						/>
																					</div>
																					<div className="flex flex-1 flex-col gap-1">
																						<input
																							type="text"
																							className="h-auto w-full truncate bg-transparent p-0 text-sm"
																							value={urlSource.src}
																							readOnly
																							disabled
																						/>
																						<div className="flex items-center gap-3">
																							<Button
																								variant={"link"}
																								className="h-auto gap-1 p-0 text-muted-foreground text-xs"
																							>
																								<Globe size={12} />
																								Visit
																							</Button>
																							<Button
																								variant={"link"}
																								className="h-auto gap-1 p-0 text-muted-foreground text-xs"
																							>
																								<Copy size={12} />
																								Copy
																							</Button>
																						</div>
																					</div>

																					<QuickTooltip
																						content={
																							<iframe
																								title={urlSource.src}
																								src={urlSource.src}
																								className="overflow-hidden rounded-lg border border-border"
																							/>
																						}
																					>
																						<Wrapper>
																							<Button
																								variant="outline"
																								size={"sm"}
																								onClick={() =>
																									setActiveIndex(index)
																								}
																							>
																								<Eye size={16} />
																							</Button>
																						</Wrapper>
																					</QuickTooltip>
																				</div>
																			</div>
																		);
																	})}
																{urlSources.length > 2 && (
																	<div className="flex items-center justify-center">
																		<Wrapper>
																			<Button
																				variant={"link"}
																				size={"sm"}
																				className="text-xs"
																				onClick={() => {
																					setActiveIndex(2);
																				}}
																			>
																				View all attachments
																			</Button>
																		</Wrapper>
																	</div>
																)}
															</>
														);
													}}
												/>
											</div>
										</div>
									)}
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
