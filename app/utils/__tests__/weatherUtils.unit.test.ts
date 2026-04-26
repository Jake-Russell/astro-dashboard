import { describe, it, expect, beforeEach } from "vitest";
import {
    calculateHourlyScore,
    getAstronomicalDarknessWindow,
    getAstroScore,
    getCloudScore,
    getMoonIlluminationScore,
    getMoonVisibilityScore,
    getScoreSummary,
} from "../weatherUtils";

describe("weatherUtils", () => {
    describe("getCloudScore", () => {
        it("should return 10 for 0% cloud coverage", () => {
            expect(getCloudScore(0)).toBe(10);
        });

        it("should return 0 for 100% cloud coverage", () => {
            expect(getCloudScore(100)).toBe(0);
        });

        it("should return 5 for 50% cloud coverage", () => {
            expect(getCloudScore(50)).toBe(5);
        });
    });

    describe("getMoonIlluminationScore", () => {
        it("should return 10 for 0% moon illumination", () => {
            expect(getMoonIlluminationScore(0)).toBe(10);
        });

        it("should return 0 for 100% moon illumination", () => {
            expect(getMoonIlluminationScore(100)).toBe(0);
        });

        it("should return 5 for 50% moon illumination", () => {
            expect(getMoonIlluminationScore(50)).toBe(5);
        });
    });

    describe("getMoonVisibilityScore", () => {
        it("should return 10 when moon is not up", () => {
            expect(getMoonVisibilityScore(false)).toBe(10);
        });

        it("should return 0 when moon is up", () => {
            expect(getMoonVisibilityScore(true)).toBe(0);
        });
    });

    describe("calculateHourlyScore", () => {
        it("should calculate correct weighted score", () => {
            const cloudCoverage = 50;
            const moonIllumination = 20;
            const moonUp = false;

            const result = calculateHourlyScore(cloudCoverage, moonIllumination, moonUp);

            const expected =
                5 * 0.5 + // clouds
                8 * 0.3 + // illumination
                10 * 0.2; // visibility

            expect(result.total).toBeCloseTo(expected);
        });
    });

    describe("getAstronomicalDarknessWindow", () => {
        it("should calculate correct darkness window", () => {
            const sunset = 1776712231;
            const sunrise = 1776747491;

            const result = getAstronomicalDarknessWindow(sunset, sunrise);

            expect(result.darkStart).toBe(sunset + 90 * 60);
            expect(result.darkEnd).toBe(sunrise - 90 * 60);
        });
    });

    describe("getScoreSummary", () => {
        it("should return poor, given very cloudy skies", () => {
            expect(getScoreSummary(85, 10, false)).toContain("heavy cloud");
        });

        it("should return very poor, given bright moon + clouds", () => {
            expect(getScoreSummary(70, 80, true)).toContain("Very poor");
        });

        it("should return poor, given bright moon alone", () => {
            expect(getScoreSummary(10, 80, true)).toContain("bright moon");
        });

        it("should return below average, given cloudy skies", () => {
            expect(getScoreSummary(65, 20, false)).toContain("Below average");
        });

        it("should return excellent, given clear dark skies", () => {
            expect(getScoreSummary(10, 10, false)).toContain("Excellent");
        });

        it("should return good, given mostly clear skies", () => {
            expect(getScoreSummary(30, 20, false)).toContain("Good");
        });

        it("should return mixed conditions, given moderate moon and some clouds", () => {
            expect(getScoreSummary(50, 50, true)).toContain("Mixed conditions");
        });
    });

    describe("getAstroScore", () => {
        const createMockHourlyData = (count: number, baseTime: number) =>
            Array.from({ length: count }, (_, i) => ({
                dt: baseTime + i * 3600,
                clouds: 20 + i * 5, // Gradually increasing cloud cover
            }));

        let latitude: number;
        let longitude: number;
        let moonIllumination: number;
        let sunset: number;
        let sunrise: number;
        let moonrise: number;
        let moonset: number;
        let hourlyData: Array<{ dt: number; clouds: number }>;

        beforeEach(() => {
            latitude = 51.75;
            longitude = -1.25;
            moonIllumination = 50;

            sunset = 1776712231;
            sunrise = 1776747491;

            moonrise = sunset + 1800; // 30 minutes after sunset
            moonset = sunrise - 1800; // 30 minutes before sunrise
            hourlyData = createMockHourlyData(10, sunset);
        });

        it("should return valid structure", () => {
            const result = getAstroScore(
                hourlyData,
                moonIllumination,
                moonrise,
                moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            expect(result).toHaveProperty("currentScore");
            expect(result).toHaveProperty("hourlyScores");
            expect(result).toHaveProperty("primeTimeStart");
            expect(result).toHaveProperty("primeTimeEnd");
            expect(result).toHaveProperty("primeScore");
        });

        it("should return single-hour result, given only one dark hour is available", () => {
            const singleHour = [{ dt: sunset + 3600, clouds: 20 }];

            const result = getAstroScore(
                singleHour,
                moonIllumination,
                moonrise,
                moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            expect(result.hourlyScores).toHaveLength(1);
            expect(result.primeTimeStart).toBe(singleHour[0].dt);
            expect(result.primeTimeEnd).toBeDefined();
            expect(result.primeScore).toBe(result.currentScore);
        });

        it("should calculate higher scores, given clear skies", () => {
            const clear = Array.from({ length: 10 }, (_, i) => ({
                dt: sunset + i * 3600,
                clouds: 10,
            }));

            const cloudy = Array.from({ length: 10 }, (_, i) => ({
                dt: sunset + i * 3600,
                clouds: 90,
            }));

            const clearResult = getAstroScore(
                clear,
                moonIllumination,
                moonrise,
                moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            const cloudyResult = getAstroScore(
                cloudy,
                moonIllumination,
                moonrise,
                moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            expect(clearResult.currentScore).toBeGreaterThan(cloudyResult.currentScore);
        });

        it("should calculate higher scores, given moon is below horizon", () => {
            const moonDown = {
                moonrise: sunset + 999999,
                moonset: sunset - 999999,
            };

            const moonUp = {
                moonrise: sunset - 999999,
                moonset: sunset + 999999,
            };

            const down = getAstroScore(
                hourlyData,
                moonIllumination,
                moonDown.moonrise,
                moonDown.moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            const up = getAstroScore(
                hourlyData,
                moonIllumination,
                moonUp.moonrise,
                moonUp.moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            expect(down.currentScore).toBeGreaterThan(up.currentScore);
        });

        it("should calculate higher scores, given lower moon illumination", () => {
            const low = getAstroScore(
                hourlyData,
                0,
                moonrise,
                moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            const high = getAstroScore(
                hourlyData,
                100,
                moonrise,
                moonset,
                sunset,
                sunrise,
                latitude,
                longitude,
            );

            expect(low.currentScore).toBeGreaterThan(high.currentScore);
        });
    });
});
