"use client";
import Logo from "@/assets/Hypercerts.svg";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { blo } from "blo";
import {
	AlertCircle,
	Copy,
	CopyCheck,
	Loader2,
	LogOut,
	Settings,
	User,
	UserRound,
	Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const UserSheet = ({ children }: { children: React.ReactNode }) => {
	const [open, setOpen] = useState(false);
	const { open: openWeb3Modal } = useWeb3Modal();

	const { address, isConnecting, isDisconnected } = useAccount();

	const [isAddressCopied, setIsAddressCopied] = useState(false);
	const copyAddress = () => {
		if (!address) return;
		navigator.clipboard.writeText(address);
		setIsAddressCopied(true);
		setTimeout(() => {
			setIsAddressCopied(false);
		}, 2000);
	};

	const closeUserSheetAndOpenWeb3Modal = () => {
		setOpen(false);
		openWeb3Modal();
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="cursor-pointer" asChild>
				{children}
			</SheetTrigger>
			<SheetContent className="group flex flex-col items-center justify-start">
				<div className="relative w-full">
					<Image
						src="/user-sheet-images/Forest.webp"
						alt="GainForest Cover"
						width={400}
						height={400}
						className="h-[200px] w-full origin-bottom scale-[1.1] transition-all group-hover:scale-[1.01]"
					/>
					<span className="absolute top-4 left-4 flex scale-100 items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-black text-sm backdrop-blur-lg">
						<Image
							src="/assets/media/images/logo.svg"
							className="h-6 w-6 object-cover object-center brightness-[0.6] drop-shadow-sm"
							alt="Gainforest"
							width={100}
							height={200}
						/>
						GainForest
					</span>
					<div className="absolute right-0 bottom-0 left-0 h-16 w-full bg-gradient-to-b from-transparent to-background" />
				</div>
				{isDisconnected ? (
					<div className="-mt-12 flex w-full flex-1 flex-col">
						<div className="flex w-full flex-col items-center gap-4 px-4">
							<div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-destructive/50 bg-background/50 shadow-xl backdrop-blur-lg">
								<AlertCircle size={40} className="text-destructive" />
							</div>
							<span className="flex w-[80%] items-center justify-center text-center font-bold text-lg text-muted-foreground leading-none">
								Not Connected
							</span>
							<p className="flex w-[80%] items-center justify-center text-center text-muted-foreground">
								Please connect your wallet to use the application.
							</p>
							<Button
								className="gap-2"
								onClick={closeUserSheetAndOpenWeb3Modal}
							>
								<Wallet size={16} />
								Connect
							</Button>
						</div>
					</div>
				) : isConnecting ? (
					<div className="flex w-full flex-1 flex-col">
						<div className="flex w-full flex-col items-center gap-4 px-4 py-8">
							<Loader2 className="animate-spin text-primary" size={40} />
							<span className="flex w-[80%] items-center justify-center text-center font-bold text-lg text-muted-foreground leading-none">
								Connecting
							</span>
							<p className="flex w-[80%] items-center justify-center text-center text-muted-foreground">
								Please wait while your wallet is being connected.
							</p>
						</div>
					</div>
				) : (
					<div className="-mt-12 flex w-full flex-1 flex-col">
						<div className="flex w-full flex-col items-center gap-4 px-4">
							<Avatar className="h-24 w-24 border-4 border-foreground shadow-xl">
								<AvatarImage
									src={address ? blo(address) : ""}
									alt="ENS Avatar"
								/>
								<AvatarFallback>
									<UserRound />
								</AvatarFallback>
							</Avatar>
							<span className="flex w-[80%] items-center justify-center break-all text-center font-bold text-lg text-muted-foreground leading-none">
								{address}
							</span>
							<Button
								variant={"ghost"}
								className="-mt-2 mb-2 gap-2"
								onClick={copyAddress}
								disabled={!address}
							>
								{isAddressCopied ? <CopyCheck size={16} /> : <Copy size={16} />}
								{isAddressCopied ? "Copied" : "Copy Address"}
							</Button>
						</div>
						<div className="flex w-full flex-1 flex-col items-center p-4">
							<ul className="flex w-full flex-1 flex-col gap-1">
								<li className="w-full">
									<Link href={`/profile/${address}`}>
										<Button
											className="w-full justify-start gap-2 text-left"
											variant={"secondary"}
										>
											<User size={16} />
											Profile
										</Button>
									</Link>
								</li>
								<li className="w-full">
									<Link href={`/profile/${address}/settings`}>
										<Button
											className="w-full justify-start gap-2 text-left"
											variant={"secondary"}
										>
											<Settings size={16} />
											Settings
										</Button>
									</Link>
								</li>
							</ul>
							<Button
								variant={"destructive"}
								className="w-full gap-2"
								onClick={closeUserSheetAndOpenWeb3Modal}
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
