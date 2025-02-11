/* Example in Node.js */

import type { NextRequest } from "next/server";

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

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const symbol = searchParams.get("symbol");
	if (!symbol) {
		return Response.json(
			{ error: "Missing symbol parameter" },
			{ status: 400 },
		);
	}

	let tokenId: number | null = null;
	if (symbol === "CELO") {
		tokenId = 5567;
	}

	if (!tokenId) {
		return Response.json(
			{ error: "Invalid symbol parameter" },
			{ status: 400 },
		);
	}

	const response = await fetch(
		`https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=1&convert_id=2781&id=${tokenId}`,
	);
	const data: ApiResponse<typeof symbol> = await response.json();
	console.log(data);
	return Response.json({ usdPrice: data?.data?.quote[0]?.price ?? null });
}
