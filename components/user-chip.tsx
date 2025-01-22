"use client";
import useCopy from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import ENSName from "./ui/ens-name";
import EthAvatar from "./ui/eth-avatar";

const UserChip = ({
	address,
	avatarSize = 22,
	showCopyButton = true,
	className,
}: {
	address: `0x${string}`;
	className?: string;
	avatarSize?: number;
	showCopyButton?: boolean;
}) => {
	const { copy, isCopied } = useCopy();
	return (
		<li
			className={cn(
				"group/user-chip flex items-center gap-1.5 rounded-full border border-transparent bg-muted/80 p-2 pr-3 hover:border-border hover:bg-muted",
				className,
			)}
		>
			<EthAvatar address={address} size={avatarSize} />
			<span className="text-sm">
				<ENSName address={address} shortenedLength={8} />
			</span>
			{showCopyButton && (
				<button
					type="button"
					className="p-0 text-inherit opacity-50 focus:opacity-100 group-hover/user-chip:opacity-100"
					onClick={() => {
						copy(address);
					}}
				>
					{isCopied ? <Check size={14} /> : <Copy size={14} />}
				</button>
			)}
		</li>
	);
};

export default UserChip;
