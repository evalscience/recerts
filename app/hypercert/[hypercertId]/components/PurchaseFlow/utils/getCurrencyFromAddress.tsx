import {
	type ChainId,
	type Currency,
	currenciesByNetwork,
} from "@hypercerts-org/marketplace-sdk";

export const getCurrencyFromAddress = (
	chainId: number,
	address: string,
): Currency | null => {
	if (!chainId) return null;
	const _chainId = chainId as ChainId;
	if (_chainId in currenciesByNetwork) {
		const symbolToCurrencyMap = currenciesByNetwork[_chainId];
		const currency = Object.values(symbolToCurrencyMap).find(
			(c: { address: string }) =>
				c.address.toLowerCase() === address.toLowerCase(),
		);
		return currency ?? null;
	}
	return null;
};
