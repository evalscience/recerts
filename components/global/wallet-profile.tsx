"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { normalize } from "viem/ens";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { blo } from "blo";
import { Loader2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";
import { ConnectButton } from "./connect-button";
import UserSheet from "./user-sheet";

const WalletProfile = () => {
	const { address, isConnecting, isDisconnected } = useAccount();

	if (isConnecting)
		return <Loader2 className="mr-2 animate-spin text-primary" />;
	if (isDisconnected) return <ConnectButton />;

	return (
		<UserSheet>
			<Avatar className="h-10 w-10">
				<AvatarImage src={address ? blo(address) : ""} alt="ENS Avatar" />
				<AvatarFallback>
					<UserRound />
				</AvatarFallback>
			</Avatar>
		</UserSheet>
	);
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };
