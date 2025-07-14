import BigNumber from "bignumber.js";

export function calcUnitsFromTokens(
	tokenAmount: number,
	totalUnitsInOrder: bigint,
	pricePerPercentInToken: number,
): bigint {
	if (!pricePerPercentInToken || !totalUnitsInOrder) return 0n;
	const percentBn = BigNumber(tokenAmount).div(pricePerPercentInToken);
	const totalUnitsInOrderBn = BigNumber(totalUnitsInOrder.toString());
	const unitsPerPercentBn = totalUnitsInOrderBn.div(100);
	return BigInt(
		Math.floor(percentBn.multipliedBy(unitsPerPercentBn).toNumber()),
	);
}
