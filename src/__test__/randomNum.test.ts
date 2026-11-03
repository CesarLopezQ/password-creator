import { describe, expect, it } from "vitest";
import randomNum from "../utils/randomNum";

describe("randomNum", () => {
	it("returns an integer within the requested range", () => {
		for (let i = 0; i < 1000; i++) {
			const result = randomNum(10);

			expect(Number.isInteger(result)).toBe(true);
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThan(10);
		}
	});

	it("returns zero when the range is one", () => {
		expect(randomNum(1)).toBe(0);
	});

	it("throws an error for invalid ranges", () => {
		expect(() => randomNum(0)).toThrow(RangeError);
		expect(() => randomNum(-1)).toThrow(RangeError);
		expect(() => randomNum(1.5)).toThrow(RangeError);
	});
});
