import MarkdownEditor from "@/components/ui/mdx-editor";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UserChip from "@/components/user-chip";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { bigintToFormattedDate } from "@/lib/utils";
import { CalendarCheck, CalendarDays, User2 } from "lucide-react";
import type React from "react";
import VerificationIndicator from "./VerificationIndicator";
import NFT3D from "./nft-3d";
import Support from "./support";

const MetadataCard = ({
	title,
	children,
}: {
	title: React.ReactNode;
	children: React.ReactNode;
}) => {
	return (
		<div className="flex shrink-0 flex-col justify-between gap-1 rounded-lg border border-border/60 bg-background/40 p-2 text-sm">
			<span className="text-[11px] text-muted-foreground uppercase tracking-wide">
				{title}
			</span>
			{children}
		</div>
	);
};

const Metadata = ({ hypercert }: { hypercert: FullHypercert }) => {
	const work = hypercert.metadata.work;
	return (
		<ScrollArea className="w-full">
			<div className="flex items-stretch gap-2 p-2">
				<MetadataCard
					title={
						<span className="flex items-center gap-1">
							<User2 size={14} /> Created by
						</span>
					}
				>
					<UserChip
						className="p-0.5"
						avatarSize={20}
						address={hypercert.creatorAddress as `0x${string}`}
					/>
				</MetadataCard>
				<MetadataCard
					title={
						<span className="flex items-center gap-1">
							<CalendarCheck size={14} /> Created on
						</span>
					}
				>
					{bigintToFormattedDate(hypercert.creationBlockTimestamp)}
				</MetadataCard>
				{work.from !== undefined && work.to !== undefined && (
					<MetadataCard
						title={
							<span className="flex items-center gap-1">
								<CalendarDays size={14} /> Work Timeframe
							</span>
						}
					>
						{bigintToFormattedDate(work.from)}
						{" - "}
						{bigintToFormattedDate(work.to)}
					</MetadataCard>
				)}
				<div className="h-2 w-[20%]" />
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
};

const LeftContent = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="flex w-full flex-initial flex-col gap-6 lg:w-auto lg:flex-[3]">
			<div className="overflow-hidden rounded-xl border border-border/60 bg-background/40">
				<VerificationIndicator />
				<div className="flex w-full flex-col items-center justify-center p-3 md:p-4">
					<div className="w-full max-w-sm">
						<NFT3D src={`/api/hypercert-image/${hypercert.hypercertId}`} />
					</div>
					<section className="my-3 flex w-full flex-col gap-3 p-1">
						<Metadata hypercert={hypercert} />
						<div className="flex flex-col gap-2">
							<h1 className="font-baskerville text-xl">Abstract</h1>
							<div className="text-sm leading-relaxed">
								<MarkdownEditor
									markdown={hypercert.metadata.description ?? ""}
									editorRef={null}
									showToolbar={false}
									readOnly
								/>
							</div>
						</div>
					</section>
				</div>
			</div>

			<Support hypercert={hypercert} />
		</div>
	);
};

export default LeftContent;
