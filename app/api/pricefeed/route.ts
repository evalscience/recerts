/* Example in Node.js */

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

export async function GET(request: Request) {
	const requestData: { symbol: string } = await request.json();
	const symbol = requestData.symbol;

	const response = await fetch(
		"https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=1&convert_id=2781&id=5567",
	);
	const data: ApiResponse<typeof symbol> = await response.json();
	return Response.json({ usdPrice: data?.data?.quote[0]?.price ?? null });
}
