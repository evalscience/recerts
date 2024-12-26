export const calculateBigIntPercentage = (
  numerator: bigint | string | null | undefined,
  denominator: bigint | string | null | undefined
) => {
  if (numerator === null || numerator === undefined) return undefined;
  if (denominator === null || denominator === undefined) return undefined;
  if (denominator === 0n || denominator === "0") return undefined;

  return Number((BigInt(numerator) * BigInt(100)) / BigInt(denominator));
};
