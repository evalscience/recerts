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
import { useActiveWallet, useWallets } from "@privy-io/react-auth";
import { Check, ChevronDown, Wallet } from "lucide-react";

export function WalletSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
	const { wallets } = useWallets();
	const { activeWallet, setActiveWallet } = useActiveWallet();

	if (!wallets.length || wallets.length === 1) return null;

	const getWalletIcon = (walletType: string) => {
		switch (walletType) {
			case "metamask":
				return "🦊";
			case "coinbase_wallet":
				return "🔵";
			case "walletconnect":
				return "🔗";
			case "embedded":
				return "💼";
			default:
				return "👛";
		}
	};

	const getWalletName = (walletType: string) => {
		switch (walletType) {
			case "metamask":
				return "MetaMask";
			case "coinbase_wallet":
				return "Coinbase Wallet";
			case "walletconnect":
				return "WalletConnect";
			case "embedded":
				return "Embedded Wallet";
			default:
				return "Wallet";
		}
	};

	const formatAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={
						fullWidth
							? "h-10 w-full justify-between gap-2 rounded-lg border border-neutral-200 px-3 text-neutral-700 text-sm transition-all dark:border-neutral-700 dark:hover:bg-neutral-900 hover:bg-neutral-50 dark:text-neutral-300"
							: "h-auto gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1.5 font-medium text-neutral-700 text-xs transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-neutral-100 dark:text-neutral-300"
					}
				>
					<div className="flex items-center gap-2">
						<span className={fullWidth ? "text-sm" : "text-xs"}>
							{getWalletIcon(activeWallet?.walletClientType || "")}
						</span>
						<span className={fullWidth ? "" : "hidden sm:inline"}>
							{getWalletName(activeWallet?.walletClientType || "")}
						</span>
					</div>
					<ChevronDown className="h-2.5 w-2.5 flex-shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="flex items-center gap-2">
					<Wallet className="h-4 w-4" />
					Switch Wallet
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{wallets.map((wallet) => (
					<DropdownMenuItem
						key={wallet.address}
						onClick={() => setActiveWallet(wallet)}
						className="flex cursor-pointer items-center justify-between"
					>
						<div className="flex items-center gap-2">
							<span className="text-lg">
								{getWalletIcon(wallet.walletClientType)}
							</span>
							<div className="flex flex-col">
								<span className="font-medium">
									{getWalletName(wallet.walletClientType)}
								</span>
								<span className="text-muted-foreground text-xs">
									{formatAddress(wallet.address)}
								</span>
							</div>
						</div>
						{activeWallet?.address === wallet.address && (
							<Check className="h-4 w-4 text-primary" />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
