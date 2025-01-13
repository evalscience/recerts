import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { CheckCircle, XCircle } from "lucide-react";

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
	currentChainId,
	supportedChainId,
}: {
	isConnected: boolean;
	currentChainId?: string;
	supportedChainId?: string;
}) => {
	const { open: openConnectModal } = useWeb3Modal();
	const isOnCorrectChain =
		supportedChainId !== undefined &&
		currentChainId !== undefined &&
		supportedChainId === currentChainId;

	return (
		<ul className="flex flex-col gap-2">
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
				complete={isConnected && isOnCorrectChain}
				title="Switch"
				description={
					supportedChainId
						? "You need to be on the correct chain."
						: "No orders or chains found."
				}
				className={isConnected ? "" : supportedChainId ? "" : "opacity-50"}
				completionButton={
					isConnected &&
					supportedChainId && (
						<Button
							size={"sm"}
							onClick={() => openConnectModal({ view: "Networks" })}
						>
							Switch
						</Button>
					)
				}
			/>
		</ul>
	);
};

export default Prerequisites;
