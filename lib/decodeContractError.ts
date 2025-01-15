import {
	HypercertExchangeAbi,
	OrderValidatorV2AAbi,
	TransferManagerAbi,
} from "@hypercerts-org/contracts";
import { decodeErrorResult } from "viem";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function decodeContractError(error: any, defaultMessage: string) {
	const abis = [TransferManagerAbi, HypercertExchangeAbi, OrderValidatorV2AAbi];
	// @ts-ignore
	const transactionData = error?.info?.error?.data?.originalError?.data as
		| `0x${string}`
		| undefined;

	if (!transactionData) {
		return defaultMessage;
	}

	let parsedError: string | undefined;

	for (const abi of abis) {
		try {
			const decodedError = decodeErrorResult({
				abi,
				data: transactionData,
			});
			if (decodedError) {
				parsedError = decodedError.errorName;
				break;
			}
		} catch {}
	}

	return parsedError || defaultMessage;
}
