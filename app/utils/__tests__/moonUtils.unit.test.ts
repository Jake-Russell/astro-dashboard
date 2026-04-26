import { getAdjustedMoonRiseAndSet, getMoonPhase } from "../moonUtils";

describe("moonUtils", () => {
    describe("getAdjustedMoonRiseAndSet", () => {
        let moonriseEpoch: number;
        let moonsetEpoch: number;
        let nextDayMoonsetEpoch: number;

        beforeEach(() => {
            moonriseEpoch = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
            moonsetEpoch = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
            nextDayMoonsetEpoch = new Date("2025-01-02T23:00:00Z").getTime() / 1000; // 11 PM next day
        });

        it("should return today's moonrise and moonset, given moonrise is before moonset", () => {
            const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
                moonriseEpoch,
                moonsetEpoch,
                nextDayMoonsetEpoch,
            );

            expect(moonrise).toBe(moonriseEpoch);
            expect(moonset).toBe(moonsetEpoch);
        });

        it("should return today's moonrise and tomorrow's moonset, given moonrise is after moonset", () => {
            moonsetEpoch = new Date("2025-01-01T04:00:00Z").getTime() / 1000; // 4 AM

            const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
                moonriseEpoch,
                moonsetEpoch,
                nextDayMoonsetEpoch,
            );

            expect(moonrise).toBe(moonriseEpoch);
            expect(moonset).toBe(nextDayMoonsetEpoch);
        });
    });

    describe("getMoonPhase", () => {
        it.each([
            ["New Moon", 0],
            ["Waxing Crescent", 0.125],
            ["First Quarter", 0.25],
            ["Waxing Gibbous", 0.375],
            ["Full Moon", 0.5],
            ["Waning Gibbous", 0.625],
            ["Last Quarter", 0.75],
            ["Waning Crescent", 0.875],
            ["New Moon", 1],
        ])("should return %s, given phase is %d", (expected, phase) => {
            expect(getMoonPhase(phase)).toBe(expected);
        });
    });
});
