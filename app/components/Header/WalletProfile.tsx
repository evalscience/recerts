"use client";
import { ConnectButton } from "@/components/global/connect-button";
import { SignInButton } from "@/components/global/signin-button";
import UserSheet from "@/components/global/user-sheet";
import EthAvatar from "@/components/ui/eth-avatar";
import useAccount from "@/hooks/use-account";
import { Loader2 } from "lucide-react";

const WalletProfile = () => {
	const { address, isConnecting, isConnected, authenticated } = useAccount();

	if (isConnecting)
		return <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />;
	if (!authenticated) return <SignInButton />;
	if (!isConnected) return <ConnectButton />;

	return (
		<UserSheet>
			<div className="flex cursor-pointer items-center rounded-full p-1 transition-colors dark:hover:bg-neutral-800 hover:bg-neutral-100">
				<EthAvatar
					address={address ? (address as `0x${string}`) : "0x0"}
					size={28}
				/>
			</div>
		</UserSheet>
	);
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };
