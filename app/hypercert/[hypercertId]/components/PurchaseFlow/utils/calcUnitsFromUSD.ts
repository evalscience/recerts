import BigNumber from "bignumber.js";

export function calcUnitsFromUSD(
	usdAmount: number,
	totalUnitsInOrder: bigint,
	pricePerPercentInUSD: number,
): bigint {
	if (!pricePerPercentInUSD || !totalUnitsInOrder) return 0n;
	const percentBn = BigNumber(usdAmount).div(pricePerPercentInUSD);
	const totalUnitsInOrderBn = BigNumber(totalUnitsInOrder.toString());
	const unitsPerPercentBn = totalUnitsInOrderBn.div(100);
	return BigInt(
		Math.floor(percentBn.multipliedBy(unitsPerPercentBn).toNumber()),
	);
}
