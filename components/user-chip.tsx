"use client";
import useCopy from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useEnsName } from "wagmi";
import { Button } from "./ui/button";
import ENSName from "./ui/ens-name";
import EthAvatar from "./ui/eth-avatar";

const UserChip = ({
	address,
	avatarSize = 22,
	showCopyButton = "always",
	className,
	avatarAndLabelGap = 6,
}: {
	address: `0x${string}`;
	className?: string;
	avatarSize?: number;
	showCopyButton?: "always" | "hover" | "never";
	avatarAndLabelGap?: number;
}) => {
	const { copy, isCopied } = useCopy();
	const { data: ensName } = useEnsName({
		address,
		chainId: 1,
	});
	return (
		<li
			className={cn(
				"group/user-chip flex items-center justify-between gap-1.5 rounded-full border border-transparent bg-muted/80 p-2 text-sm hover:border-border hover:bg-muted",
				className,
			)}
		>
			<div
				className="flex flex-1 items-center justify-center"
				style={{ gap: `${avatarAndLabelGap}px` }}
			>
				<EthAvatar address={address} size={avatarSize} />
				<input
					className="flex-1 truncate bg-transparent"
					value={ensName ?? address}
					readOnly
					disabled
				/>
			</div>
			{showCopyButton !== "never" && (
				<button
					type="button"
					className={cn(
						showCopyButton === "hover" ? "opacity-0" : "opacity-50",
						"flex shrink-0 items-center justify-center rounded-full p-0 focus:opacity-100 group-hover/user-chip:opacity-100",
					)}
					style={{
						height: `${avatarSize}px`,
						width: `${avatarSize}px`,
					}}
					onClick={() => {
						copy(address);
					}}
				>
					{isCopied ? (
						<Check size={avatarSize / 1.75} />
					) : (
						<Copy size={avatarSize / 1.75} />
					)}
				</button>
			)}
		</li>
	);
};

export default UserChip;
