"use client";
import { ConnectButton } from "@/components/global/connect-button";
import UserSheet from "@/components/global/user-sheet";
import EthAvatar from "@/components/ui/eth-avatar";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import { getChainInfo } from "@/lib/chainInfo";
import { cn } from "@/lib/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Loader2, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { normalize } from "viem/ens";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

const WalletProfile = () => {
	const { address, isConnecting, isDisconnected, chain } = useAccount();

	if (isConnecting)
		return <Loader2 className="mr-2 animate-spin text-primary" />;
	if (isDisconnected) return <ConnectButton />;

	const isChainSupported =
		SUPPORTED_CHAINS.find(
			(supportedChain) => supportedChain.id === chain?.id,
		) !== undefined;

	const chainInfo = getChainInfo(chain?.id);

	return (
		<UserSheet>
			<div
				className={cn(
					"flex items-center rounded-full p-1",
					isChainSupported ? "bg-green-500/20" : "bg-black/20",
				)}
			>
				<div className="mx-2 flex items-center gap-2">
					{chainInfo ? (
						<Image
							src={chainInfo.logoSrc}
							alt={`${chainInfo.label} logo`}
							width={18}
							height={18}
							className="rounded-sm"
						/>
					) : null}
					<span
						className={cn(
							"font-bold font-sans",
							isChainSupported
								? "text-green-700 dark:text-green-300"
								: "text-black",
						)}
					>
						{chainInfo?.label ?? chain?.name ?? "Unknown"}
					</span>
				</div>
				<EthAvatar
					address={address ? (address as `0x${string}`) : "0x0"}
					size={32}
				/>
			</div>
		</UserSheet>
	);
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };
