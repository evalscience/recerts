const REALLY_BIG_BIGINT = 1000000000000000000000000000000000n;

export const calculateBigIntPercentage = (
	numerator: bigint | string | null | undefined,
	denominator: bigint | string | null | undefined,
) => {
	if (numerator === null || numerator === undefined) return undefined;
	if (denominator === null || denominator === undefined) return undefined;
	if (denominator === 0n || denominator === "0") return undefined;

	return (
		Number((BigInt(numerator) * REALLY_BIG_BIGINT) / BigInt(denominator)) /
		(Number(REALLY_BIG_BIGINT) / 100)
	);
};
