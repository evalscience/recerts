"use client";
import { ChainSwitcher } from "@/app/components/Header/ChainSwitcher";
import { WalletSwitcher } from "@/app/components/Header/WalletSwitcher";
import useAccount from "@/hooks/use-account";
import { useLogin, useLogout } from "@privy-io/react-auth";
import {
	AlertCircle,
	CircleCheck,
	Loader2,
	LogOut,
	User,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import ENSName from "../ui/ens-name";
import EthAvatar from "../ui/eth-avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

const UserSheet = ({ children }: { children: React.ReactNode }) => {
	const [open, setOpen] = useState(false);
	const { address, isConnected, authenticated } = useAccount();
	const { login } = useLogin();
	const { logout } = useLogout();

	const [isAddressCopied, setIsAddressCopied] = useState(false);
	const copyAddress = () => {
		if (!address) return;
		navigator.clipboard.writeText(address);
		setIsAddressCopied(true);
		setTimeout(() => {
			setIsAddressCopied(false);
		}, 2000);
	};

	const closeUserSheetAndLogin = () => {
		setOpen(false);
		login();
	};

	const closeUserSheetAndLogout = () => {
		setOpen(false);
		logout();
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="cursor-pointer">{children}</SheetTrigger>
			<SheetContent className="w-80 p-0">
				{!authenticated ? (
					<div className="flex h-full flex-col items-center justify-center gap-6 px-6">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
							<AlertCircle size={24} className="text-neutral-500" />
						</div>
						<div className="space-y-2 text-center">
							<h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
								Not Connected
							</h3>
							<p className="text-neutral-600 text-sm dark:text-neutral-400">
								Connect your wallet to get started
							</p>
						</div>
						<Button onClick={closeUserSheetAndLogin} className="w-full gap-2">
							<Wallet size={16} />
							Connect Wallet
						</Button>
					</div>
				) : !isConnected ? (
					<div className="flex h-full flex-col items-center justify-center gap-6 px-6">
						<Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
						<div className="space-y-2 text-center">
							<h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
								Connecting...
							</h3>
							<p className="text-neutral-600 text-sm dark:text-neutral-400">
								Please wait while we connect your wallet
							</p>
						</div>
					</div>
				) : (
					<div className="flex h-full flex-col">
						{/* Header */}
						<div className="flex flex-col items-center gap-4 p-6 pb-4">
							<EthAvatar address={address as `0x${string}`} size={64} />
							<div className="space-y-1 text-center">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={copyAddress}
												className="font-mono text-neutral-600 text-sm transition-colors dark:hover:text-neutral-100 dark:text-neutral-400 hover:text-neutral-900"
											>
												{isAddressCopied ? (
													<span className="flex items-center gap-2 text-green-600">
														<CircleCheck size={14} />
														Copied!
													</span>
												) : (
													<ENSName address={address as `0x${string}`} />
												)}
											</button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Click to copy address</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>

						{/* Wallet & Chain Controls */}
						<div className="space-y-3 px-6">
							<div className="space-y-2">
								<label className="font-medium text-neutral-500 text-xs uppercase tracking-wide dark:text-neutral-400">
									Network
								</label>
								<ChainSwitcher fullWidth={true} />
							</div>
							<div className="space-y-2">
								<label className="font-medium text-neutral-500 text-xs uppercase tracking-wide dark:text-neutral-400">
									Wallet
								</label>
								<WalletSwitcher fullWidth={true} />
							</div>
						</div>

						{/* Divider */}
						<div className="mx-6 my-6 h-px bg-neutral-200 dark:bg-neutral-800" />

						{/* Actions */}
						<div className="flex-1 space-y-2 px-6">
							<Link href={`/profile/${address}`} onClick={() => setOpen(false)}>
								<Button
									variant="ghost"
									className="h-10 w-full justify-start gap-2"
								>
									<User size={16} />
									View Profile
								</Button>
							</Link>
						</div>

						{/* Footer */}
						<div className="p-6 pt-4">
							<Button
								variant="outline"
								onClick={closeUserSheetAndLogout}
								className="w-full gap-2 text-neutral-600 dark:hover:border-red-800 hover:border-red-200 dark:hover:text-red-400 dark:text-neutral-400 hover:text-red-600"
							>
								<LogOut size={16} />
								Disconnect
							</Button>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
};

export default UserSheet;
