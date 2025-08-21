"use client";
import SelfXYZVerificationStep0 from "@/components/modals/self-xyz-verification/step-0";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import { useModal } from "@/components/ui/modal/context";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import useCopy from "@/hooks/use-copy";
import { cn, getUrl } from "@/lib/utils";
import { blo } from "blo";
import {
	Check,
	ChevronRight,
	Copy,
	CopyCheck,
	HeartHandshake,
	Pencil,
	Settings2,
	Share2,
	Sparkle,
	UserRoundCheck,
	UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { useEnsName } from "wagmi";

const ProfileCard = ({
	address,
	stats,
	view,
}: {
	address: `0x${string}`;
	stats: {
		hypercertsCreated: number;
		hypercertsSupported: number;
		salesMadeCount: number;
	};
	view: "created" | "supported";
}) => {
	const { data: ensName, isFetching: isEnsNameLoading } = useEnsName({
		address,
		chainId: 1,
	});

	const { copy: copyAddress, isCopied: isAddressCopied } = useCopy();
	const { copy: copyProfileLink, isCopied: isProfileLinkCopied } = useCopy();
	const { show, isOpen, clear, pushModalByVariant } = useModal();
	const profileLink = getUrl(`/profile/${address}`);
	const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

	const handleSelfXYZVerification = useCallback(() => {
		if (isOpen) return;
		clear();
		pushModalByVariant({
			id: "self-xyz-verification-step-0",
			content: <SelfXYZVerificationStep0 />,
		});
		show();
	}, [isOpen, show, clear, pushModalByVariant]);

	return (
		<div className="flex w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-background/40">
			<div className="flex w-full items-center">
				<button
					type="button"
					className="flex w-full items-center justify-center gap-2 border-b border-b-border/60 bg-background/40 py-2 font-sans text-muted-foreground text-xs hover:bg-muted hover:text-foreground"
					onClick={() => copyProfileLink(profileLink)}
				>
					{isProfileLinkCopied ? <Check size={14} /> : <Share2 size={14} />}
					{isProfileLinkCopied ? "Copied profile URL" : "Share profile"}
				</button>
			</div>
			<div className="relative flex w-full flex-col items-center gap-3 p-4">
				<div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/60">
					<EthAvatar address={address as `0x${string}`} />
				</div>
				<div className="flex w-full flex-col items-center gap-1">
					{!ensName && isEnsNameLoading ? (
						<span
							className={
								"w-[80%] animate-pulse truncate text-center font-bold text-2xl text-muted-foregr"
							}
						>
							{shortAddress}
						</span>
					) : (
						<div className="flex w-full items-center justify-center">
							<span
								className={
									"max-w-[80%] truncate text-center font-semibold text-xl"
								}
							>
								{ensName ?? shortAddress}
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												className="text-muted-foreground"
												variant={"ghost"}
												size={"icon"}
												onClick={() => copyAddress(address)}
											>
												{isAddressCopied ? (
													<Check size={14} />
												) : (
													<Copy size={14} />
												)}
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											{isAddressCopied ? "Copied" : "Copy Address"}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</span>
						</div>
					)}
					{stats.hypercertsCreated + stats.salesMadeCount >= 0 && (
						<span className="flex h-6 items-center justify-center rounded-full border border-border/60 bg-background/40 px-2 text-center text-muted-foreground text-xs">
							{stats.hypercertsCreated > 0 ? "Community member" : "Author"}
						</span>
					)}
				</div>
			</div>
			<ul className="mt-1 flex w-full flex-col gap-1 border-t border-t-border/60 p-2">
				<li>
					<Link href={"?view=created"}>
						<Button
							variant={view === "created" ? "secondary" : "ghost"}
							className="w-full justify-between"
							size={"sm"}
						>
							<span className="flex items-center justify-start gap-2 text-left">
								<Sparkle size={14} className="text-primary" />
								My Hypercerts
							</span>
							<span className="flex items-center justify-end gap-1 text-right text-muted-foreground">
								<span>{stats.hypercertsCreated}</span>
								<ChevronRight size={14} />
							</span>
						</Button>
					</Link>
				</li>
				<li>
					<Link href={"?view=supported"}>
						<Button
							variant={view === "supported" ? "secondary" : "ghost"}
							className="w-full justify-between"
							size={"sm"}
						>
							<span className="flex items-center justify-start gap-2 text-left">
								<HeartHandshake size={14} className="text-primary" />
								Supported Hypercerts
							</span>
							<span className="flex items-center justify-end gap-1 text-right text-muted-foreground">
								<span>{stats.hypercertsSupported}</span>
								<ChevronRight size={14} />
							</span>
						</Button>
					</Link>
				</li>
			</ul>
			<div className="relative flex flex-col gap-2 border-t border-t-border p-2 font-sans">
				<div className="flex flex-col items-center justify-center">
					{/* <Image
            src="/assets/media/brandings/self.xyz.jpg"
            alt="Self XYZ Branding"
            width={100}
            height={40}
            className="h-6 w-auto rounded-md border border-border absolute top-1 right-1"
          /> */}
					<span className="text-balance text-center text-sm">
						Verify your humanity and get your verification badge.
					</span>
				</div>
				<Button
					className="w-full"
					size={"sm"}
					onClick={handleSelfXYZVerification}
				>
					Get Started
				</Button>
			</div>
		</div>
	);
};

export default ProfileCard;
