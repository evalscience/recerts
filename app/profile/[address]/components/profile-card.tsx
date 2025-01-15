"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { blo } from "blo";
import { Copy, Pencil, Share2 } from "lucide-react";
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
	const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
		address,
		chainId: 1,
	});
	const { address: currentAddress } = useAccount();

	const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

	return (
		<div className="relative flex w-full flex-col items-center gap-4 rounded-2xl border border-border bg-background p-4">
			{currentAddress === address && (
				<Button
					className="absolute top-4 right-4 h-8 w-8 p-0"
					variant={"outline"}
				>
					<Pencil size={16} />
				</Button>
			)}
			<div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/50">
				<Avatar className="h-20 w-20">
					<AvatarImage src={blo(address)} alt={address} />
				</Avatar>
			</div>
			<div className="flex w-full flex-col items-center gap-2">
				{isEnsNameLoading ? (
					<span
						className={
							"h-8 w-[75%] animate-pulse rounded-lg bg-muted text-muted"
						}
					/>
				) : (
					<span className={"w-[80%] truncate text-center font-bold text-2xl"}>
						{ensName ?? shortAddress}
					</span>
				)}

				{stats.hypercertsCreated + stats.fractionsCreated >= 0 && (
					<span className="flex h-6 items-center justify-center rounded-full bg-beige-muted px-2 text-center text-beige-muted-foreground text-sm">
						{stats.hypercertsCreated > 0 ? "Community Member" : "Contributor"}
					</span>
				)}
			</div>

			<div className="mt-2 flex w-full items-center gap-2">
				<Button className="flex-1 gap-2" variant={"secondary"}>
					<Copy size={16} />
					Copy Address
				</Button>
				<Button className="flex-1 gap-2" variant={"secondary"}>
					<Share2 size={16} />
					Share
				</Button>
			</div>
		</div>
	);
};

export default ProfileCard;
