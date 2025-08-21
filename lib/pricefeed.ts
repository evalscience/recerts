import { RAW_TOKENS_CONFIG } from "@/config/raw-tokens";

const symbolToCurrencyAddressMap = new Map<string, `0x${string}`>();

for (const chainId in RAW_TOKENS_CONFIG) {
	const tokens = RAW_TOKENS_CONFIG[chainId];
	for (const token of tokens) {
		symbolToCurrencyAddressMap.set(
			token.symbol,
			token.address as `0x${string}`,
		);
	}
}

const currencyAddressToSymbolMap = new Map<`0x${string}`, string>();
symbolToCurrencyAddressMap.forEach((value, key) => {
	currencyAddressToSymbolMap.set(value, key);
});

export { currencyAddressToSymbolMap };

const currencyAddressToPriceFeedIdMap = new Map<string, number>([
	[symbolToCurrencyAddressMap.get("CELO") ?? "", 5567],
]);

type ApiResponse<Symbol extends string> = {
	status: {
		timestamp: string;
		error_code: number;
		error_message: unknown | "SUCCESS";
		elapsed: string;
		credit_count: number;
	};
	data?: {
		symbol: Symbol;
		id: string;
		name: string;
		amount: number;
		last_updated: number;
		quote: {
			cryptoId: number;
			symbol: string;
			price: number;
			lastUpdated: number;
		}[];
	};
};

const getPriceFeed = async (currencyAddress: `0x${string}`) => {
	const normalizedCurrencyAddress = currencyAddress as `0x${string}`;
	const priceFeedId = currencyAddressToPriceFeedIdMap.get(
		normalizedCurrencyAddress,
	);
	const symbol = currencyAddressToSymbolMap.get(normalizedCurrencyAddress);
	if (!priceFeedId || !symbol) {
		return { usdPrice: null };
	}

	let priceFeedApiUrl = `https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=1&convert_id=2781&id=${priceFeedId}`;

	if (typeof window !== "undefined") {
		priceFeedApiUrl = `/api/price-conversion?id=${priceFeedId}&amount=1&convert_id=2781`;
	}

	const response = await fetch(priceFeedApiUrl);
	const data: ApiResponse<typeof symbol> = await response.json();
	return { usdPrice: data?.data?.quote[0]?.price ?? null };
};

export default getPriceFeed;
