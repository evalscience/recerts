"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import useAccount from "@/hooks/use-account";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, Network } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSwitchChain } from "wagmi";

export function ChainSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
	const { chainId } = useAccount();
	const { switchChain, isPending } = useSwitchChain();
	const [switchingTo, setSwitchingTo] = useState<number | null>(null);

	const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);

	const getChainIconPath = (chainName: string) => {
		switch (chainName.toLowerCase()) {
			case "filecoin mainnet":
			case "filecoin":
				return "/chain-logos/Filecoin.png";
			case "op mainnet":
			case "optimism":
				return "/chain-logos/op-mainnet.png";
			case "arbitrum one":
			case "arbitrum":
				return "/chain-logos/arbitrum.png";
			case "base":
				return "/chain-logos/base.png";
			case "celo":
				return "/chain-logos/celo.png";
			default:
				return null;
		}
	};

	const handleChainSwitch = async (chain: (typeof SUPPORTED_CHAINS)[0]) => {
		if (chain.id === chainId) return;

		setSwitchingTo(chain.id);
		try {
			await switchChain({ chainId: chain.id });
		} finally {
			setSwitchingTo(null);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						fullWidth
							? "h-10 w-full justify-between gap-2 rounded-lg border px-3 text-sm dark:hover:bg-neutral-900 hover:bg-neutral-50"
							: "h-auto gap-1.5 rounded-full border px-2 py-1.5 font-medium text-xs transition-all dark:hover:bg-neutral-800 hover:bg-neutral-100",
						currentChain
							? fullWidth
								? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
								: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
							: fullWidth
							  ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
							  : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
					)}
				>
					<div className="flex items-center gap-2">
						{currentChain && getChainIconPath(currentChain.name) ? (
							<Image
								src={getChainIconPath(currentChain.name) as string}
								alt={currentChain.name}
								width={fullWidth ? 16 : 12}
								height={fullWidth ? 16 : 12}
								className="rounded-full"
							/>
						) : (
							<span className={fullWidth ? "text-sm" : "text-xs"}>⚠️</span>
						)}
						<span
							className={
								fullWidth ? "flex" : "hidden max-w-20 truncate sm:inline"
							}
						>
							{currentChain?.name || "Unknown"}
						</span>
					</div>
					<ChevronDown className="h-2.5 w-2.5 flex-shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="flex items-center gap-2">
					<Network className="h-4 w-4" />
					Switch Network
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{SUPPORTED_CHAINS.map((chain) => (
					<DropdownMenuItem
						key={chain.id}
						onClick={() => handleChainSwitch(chain)}
						disabled={isPending && switchingTo === chain.id}
						className="flex cursor-pointer items-center justify-between"
					>
						<div className="flex items-center gap-2">
							{getChainIconPath(chain.name) ? (
								<Image
									src={getChainIconPath(chain.name) as string}
									alt={chain.name}
									width={20}
									height={20}
									className="rounded-full"
								/>
							) : (
								<span className="text-lg">🔗</span>
							)}
							<span className="font-medium">{chain.name}</span>
						</div>
						<div className="flex items-center gap-1">
							{isPending && switchingTo === chain.id && (
								<Loader2 className="h-3 w-3 animate-spin" />
							)}
							{chainId === chain.id && (
								<Check className="h-4 w-4 text-primary" />
							)}
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
