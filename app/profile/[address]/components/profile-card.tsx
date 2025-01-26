"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
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
	Copy,
	CopyCheck,
	Pencil,
	Settings2,
	Share2,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAccount, useEnsName } from "wagmi";

const ProfileCard = ({
	address,
	stats,
}: {
	address: `0x${string}`;
	stats: {
		hypercertsCreated: number;
		fractionsCreated: number;
	};
}) => {
	const { data: ensName, isFetching: isEnsNameLoading } = useEnsName({
		address,
		chainId: 1,
	});
	const { address: currentAddress } = useAccount();

	const { copy: copyAddress, isCopied: isAddressCopied } = useCopy();
	const { copy: copyProfileLink, isCopied: isProfileLinkCopied } = useCopy();
	const profileLink = getUrl(`/profile/${address}`);
	const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

	return (
		<div className="relative flex w-full flex-col items-center gap-4 rounded-2xl border border-border bg-background p-4">
			<div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/50">
				<EthAvatar address={address as `0x${string}`} />
			</div>
			<div className="flex w-full flex-col items-center gap-2">
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
							className={"max-w-[80%] truncate text-center font-bold text-2xl"}
						>
							{ensName ?? shortAddress}
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className="text-muted-foreground"
											variant={"ghost"}
											size={"sm"}
											onClick={() => copyAddress(address)}
										>
											{isAddressCopied ? (
												<CopyCheck size={16} />
											) : (
												<Copy size={16} />
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
				{stats.hypercertsCreated + stats.fractionsCreated >= 0 && (
					<span className="flex h-6 items-center justify-center rounded-full bg-beige-muted px-2 text-center text-beige-muted-foreground text-sm">
						{stats.hypercertsCreated > 0 ? "Community Member" : "Contributor"}
					</span>
				)}
			</div>

			<div className="mt-2 flex w-full items-center gap-2">
				<Button
					size={"sm"}
					className="flex-1 gap-2"
					variant={"secondary"}
					onClick={() => copyProfileLink(profileLink)}
				>
					{isProfileLinkCopied ? <Check size={16} /> : <Share2 size={16} />}
					{isProfileLinkCopied ? "Copied Profile URL" : "Share Profile URL"}
				</Button>
			</div>
		</div>
	);
};

export default ProfileCard;
