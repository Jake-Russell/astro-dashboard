import { getAdjustedMoonRiseAndSet } from "../moonUtils";

describe("moonUtils", () => {
    let moonriseEpoch: number;
    let moonsetEpoch: number;
    let nextDayMoonsetEpoch: number;

    beforeEach(() => {
        moonriseEpoch = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
        moonsetEpoch = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
        nextDayMoonsetEpoch = new Date("2025-01-02T23:00:00Z").getTime() / 1000; // 11 PM next day
    });

    describe("getAdjustedMoonRiseAndSet", () => {
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

        it("should return default values, given any parameter is missing", () => {
            const { moonrise, moonset } = getAdjustedMoonRiseAndSet();

            expect(moonrise).toBe(0);
            expect(moonset).toBe(0);
        });
    });
});
