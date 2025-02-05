import { Button } from "@/components/ui/button";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import { cn } from "@/lib/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { CheckCircle, XCircle } from "lucide-react";
import type { Chain } from "viem";

const PrerequisiteCard = ({
	complete,
	title,
	description,
	completionButton,
	className,
}: {
	complete: boolean;
	title: string;
	description: string;
	completionButton?: React.ReactNode;
	className?: string;
}) => {
	return (
		<li
			className={cn(
				"flex items-center justify-between rounded-xl border border-border p-4 font-sans",
				className,
			)}
		>
			<div className="flex items-center gap-4">
				{complete ? (
					<CheckCircle size={28} className="text-green-500" />
				) : (
					<XCircle size={28} className="text-destructive" />
				)}
				<div className="flex flex-col">
					<span className="font-bold">{title}</span>
					<span className="text-muted-foreground text-sm">{description}</span>
				</div>
			</div>
			<div>{!complete && completionButton}</div>
		</li>
	);
};

const Prerequisites = ({
	isConnected,
	orderChainIdsSupportedByApp,
	isCurrentChainSupportedByApp,
	isCurrentChainSupportedByOrders,
}: {
	isConnected: boolean;
	orderChainIdsSupportedByApp: Chain[];
	isCurrentChainSupportedByApp: boolean;
	isCurrentChainSupportedByOrders: boolean;
}) => {
	const { open: openConnectModal } = useWeb3Modal();

	return (
		<ul className="flex flex-col gap-2">
			{orderChainIdsSupportedByApp.length === 0 ? (
				<PrerequisiteCard
					complete={false}
					title="Not Supported"
					description={
						"This hypercert does not have any orders on the supported chains."
					}
				/>
			) : (
				<>
					<PrerequisiteCard
						complete={isConnected}
						title="Connect Wallet"
						description={"Wallet connection is required."}
						completionButton={
							<Button size={"sm"} onClick={() => openConnectModal()}>
								Connect
							</Button>
						}
					/>
					<PrerequisiteCard
						complete={
							isConnected &&
							isCurrentChainSupportedByApp &&
							isCurrentChainSupportedByOrders
						}
						title="Switch Network"
						description={
							"Please switch to one of the supported chains to continue."
						}
						className={isConnected ? "" : "opacity-50"}
						completionButton={
							isConnected && (
								<Button
									size={"sm"}
									onClick={() => openConnectModal({ view: "Networks" })}
								>
									Switch
								</Button>
							)
						}
					/>
				</>
			)}
		</ul>
	);
};

export default Prerequisites;
