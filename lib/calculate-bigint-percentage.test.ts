import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";

describe("calculateBigIntPercentage", () => {
  it("should return the correct percentage for valid bigint inputs", () => {
    expect(calculateBigIntPercentage(100n, 1000n)).toBeCloseTo(10, 6); // 10%
    expect(calculateBigIntPercentage(1000n, 1000n)).toBeCloseTo(100, 6); // 100%
    expect(calculateBigIntPercentage(2000n, 1000n)).toBeCloseTo(200, 6); // 200%
  });

  it("should handle null and undefined inputs gracefully", () => {
    expect(calculateBigIntPercentage(null, 1000n)).toBeUndefined();
    expect(calculateBigIntPercentage(100n, null)).toBeUndefined();
    expect(calculateBigIntPercentage(undefined, 1000n)).toBeUndefined();
    expect(calculateBigIntPercentage(100n, undefined)).toBeUndefined();
  });

  it("should return undefined when the denominator is zero", () => {
    expect(calculateBigIntPercentage(100n, 0n)).toBeUndefined();
    expect(calculateBigIntPercentage(100n, "0")).toBeUndefined();
  });

  it("should work with valid bigint strings as input", () => {
    expect(calculateBigIntPercentage("100", "1000")).toBeCloseTo(10, 6); // 10%
    expect(calculateBigIntPercentage("1000", "1000")).toBeCloseTo(100, 6); // 100%
    expect(calculateBigIntPercentage("2000", "1000")).toBeCloseTo(200, 6); // 200%
  });

  it("should handle invalid or malformed strings gracefully", () => {
    expect(() => calculateBigIntPercentage("invalid", "1000")).toThrow();
    expect(() => calculateBigIntPercentage("100", "invalid")).toThrow();
  });

  it("should maintain precision in calculations, whereas number loses it", () => {
    const veryLargeNumerator =
      98765432109876543210987654321098765432109876543210n;
    const largestPossibleIntDenominator = BigInt(Number.MAX_SAFE_INTEGER);

    // Calculate with BigInt
    const bigIntResult = calculateBigIntPercentage(
      veryLargeNumerator,
      largestPossibleIntDenominator
    );

    // Calculate with Number
    const numberResult =
      (Number(veryLargeNumerator) / Number(largestPossibleIntDenominator)) *
      100;

    // Compare BigInt vs Number results
    expect(bigIntResult).not.toBeCloseTo(numberResult);
    //-------------------^^^ to verify that number results are not close to bigint results
  });
});
