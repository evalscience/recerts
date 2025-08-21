export type ChainInfo = {
	id: number;
	label: string;
	logoSrc: string; // public path
};

const CHAIN_ID_TO_INFO: Record<number, ChainInfo> = {
	8453: { id: 8453, label: "Base", logoSrc: "/chain-logos/base.png" },
	10: { id: 10, label: "OP Mainnet", logoSrc: "/chain-logos/op-mainnet.png" },
	42161: { id: 42161, label: "Arbitrum", logoSrc: "/chain-logos/arbitrum.png" },
	42220: { id: 42220, label: "Celo", logoSrc: "/chain-logos/celo.png" },
	314: { id: 314, label: "Filecoin", logoSrc: "/chain-logos/Filecoin.png" },
};

export function getChainInfo(
	chainId: number | string | undefined,
): ChainInfo | undefined {
	if (chainId === undefined || chainId === null) return undefined;
	const numericId = typeof chainId === "string" ? Number(chainId) : chainId;
	if (!Number.isFinite(numericId)) return undefined;
	return CHAIN_ID_TO_INFO[numericId as number];
}
