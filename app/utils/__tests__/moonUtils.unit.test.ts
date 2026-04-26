import {
    getAdjustedMoonRiseAndSet,
    getMoonIllumination,
    getMoonPhase,
    getNightMoonVisibility,
} from "../moonUtils";
import { mockLat, mockLng } from "../../mocks/mockLocationData";

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
        ])("should return %s, given phase is %d", (expected, phase) =>
            expect(getMoonPhase(phase)).toBe(expected),
        );

        it.each([-1, 1.5, 10])(
            "should return unknown, given phase is outside of range (%d)",
            (phase) => expect(getMoonPhase(phase)).toBe("Unknown"),
        );
    });

    describe("getMoonIllumination", () => {
        it.each([
            [0, 0], // New Moon
            [15, 0.125], // Waxing Crescent
            [50, 0.25], // First Quarter
            [85, 0.375], // Waxing Gibbous
            [100, 0.5], // Full Moon
            [85, 0.625], // Waning Gibbous
            [50, 0.75], // Last Quarter
            [15, 0.875], // Waning Crescent
            [0, 1], // New Moon
        ])("should return %d% illumination, given moon phase is %d", (expected, phase) => {
            expect(getMoonIllumination(phase)).toBe(expected);
        });
    });

    describe("getNightMoonVisibility", () => {
        const epoch = new Date("2025-01-01T00:00:00Z").getTime() / 1000;
        const sunset = epoch + 20 * 3600;
        const sunrise = epoch + 30 * 3600;

        it("should return full moon visibility, given moon is up all night", () => {
            // Moon: 18:00 → 08:00 (fully covers night)
            const moonrise = epoch + 18 * 3600;
            const moonset = epoch + 32 * 3600;

            const result = getNightMoonVisibility(
                moonrise,
                moonset,
                sunset,
                sunrise,
                mockLat,
                mockLng,
            );

            expect(result.nightDuration).toBe(10 * 60); // 600 minutes
            expect(result.moonUpDuringNight).toBe(10 * 60);
            expect(result.moonDownDuringNight).toBe(0);
        });

        it("should return zero moon visibility, given moon is fully outside night", () => {
            // Moon entirely before night
            const moonrise = epoch + 10 * 3600;
            const moonset = epoch + 15 * 3600;

            const result = getNightMoonVisibility(
                moonrise,
                moonset,
                sunset,
                sunrise,
                mockLat,
                mockLng,
            );

            expect(result.moonUpDuringNight).toBe(0);
            expect(result.moonDownDuringNight).toBe(result.nightDuration);
        });

        it("should return zero moon visibility, given moon rises after night ends", () => {
            // Moon rises AFTER night ends (07:00 UTC equivalent in this setup)
            const moonrise = epoch + 31 * 3600;
            const moonset = epoch + 33 * 3600;

            const result = getNightMoonVisibility(
                moonrise,
                moonset,
                sunset,
                sunrise,
                mockLat,
                mockLng,
            );

            expect(result.moonUpDuringNight).toBe(0);
            expect(result.moonDownDuringNight).toBe(result.nightDuration);
        });

        it("should return partial visibility, given moon overlaps start of night", () => {
            // Moon rises during night, sets after
            const moonrise = epoch + 22 * 3600;
            const moonset = epoch + 28 * 3600;

            const result = getNightMoonVisibility(
                moonrise,
                moonset,
                sunset,
                sunrise,
                mockLat,
                mockLng,
            );

            expect(result.moonUpDuringNight).toBe(6 * 60);
            expect(result.moonDownDuringNight).toBe(4 * 60);
        });

        it("should handle moonset before moonrise (crossing midnight)", () => {
            // Moon rises before midnight, sets after midnight (next day)
            const moonrise = epoch + 23 * 3600;
            const moonset = epoch + 48 * 3600; // next day

            const result = getNightMoonVisibility(
                moonrise,
                moonset,
                sunset,
                sunrise,
                mockLat,
                mockLng,
            );

            expect(result.moonUpDuringNight).toBeGreaterThanOrEqual(0);
            expect(result.moonUpDuringNight + result.moonDownDuringNight).toBe(
                result.nightDuration,
            );
        });

        it.each([
            [18, 19],
            [21, 23],
            [22, 2],
            [0, 6],
        ])(
            "should always ensure moonUp + moonDown equals night duration (moonrise: %d, moonset: %d)",
            (moonrise, moonset) => {
                const result = getNightMoonVisibility(
                    epoch + moonrise * 3600,
                    epoch + moonset * 3600,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.moonUpDuringNight + result.moonDownDuringNight).toBe(
                    result.nightDuration,
                );
            },
        );
    });
});
