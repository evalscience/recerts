import BigNumber from "bignumber.js";

export function calcUnitsFromPercentage(
	percentage: number,
	totalUnitsInOrder: bigint,
): bigint {
	if (!percentage || !totalUnitsInOrder) return 0n;
	const percentBn = BigNumber(percentage);
	const totalUnitsInOrderBn = BigNumber(totalUnitsInOrder.toString());
	const unitsPerPercentBn = totalUnitsInOrderBn.div(100);
	return BigInt(
		Math.floor(percentBn.multipliedBy(unitsPerPercentBn).toNumber()),
	);
}
