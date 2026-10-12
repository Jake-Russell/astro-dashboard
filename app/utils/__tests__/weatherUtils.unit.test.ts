import { describe, it, expect, beforeEach } from "vitest";
import { getMoonPosition } from "suncalc";
import { mockLat, mockLng } from "../../mocks/mockLocationData";
import { mockDayData } from "../../mocks/mockWeatherData";
import {
    calculateHourlyScore,
    getAstroScore,
    getCloudScore,
    getMoonIlluminationScore,
    getMoonScore,
    getScoreSummary,
    CLOUD_WEIGHT,
    MOON_WEIGHT,
    getMoonAltitudeScore,
    getMoonAltitude,
} from "../weatherUtils";

vi.mock("suncalc", () => ({
    getMoonPosition: vi.fn(),
}));

describe("weatherUtils", () => {
    const getMoonPositionMock = vi.mocked(getMoonPosition);
    beforeEach(() => {
        vi.clearAllMocks();

        getMoonPositionMock.mockReturnValue({
            altitude: 30,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    });

    describe("getMoonAltitude", () => {
        it.each([30.126, -12.345])(
            "should round the moon altitude to 2 decimal places (%s)",
            (alt) => {
                getMoonPositionMock.mockReturnValue({
                    altitude: alt,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const expected = Math.round(alt * 100) / 100;

                expect(getMoonAltitude(mockDayData[0].dt, mockLat, mockLng)).toBe(expected);
            },
        );

        it("should return zero when the moon is exactly on the horizon", () => {
            getMoonPositionMock.mockReturnValue({
                altitude: 0,
                azimuth: 0,
                distance: 0,
                parallacticAngle: 0,
            });

            expect(getMoonAltitude(mockDayData[0].dt, mockLat, mockLng)).toBe(0);
        });
    });

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

    describe("getMoonScore", () => {
        it("should return 10 when the moon is below the horizon, regardless of illumination", () => {
            expect(getMoonScore(0, -10)).toEqual({ total: 10, illumination: 10, altitude: 10 });
            expect(getMoonScore(50, -10)).toEqual({ total: 10, illumination: 10, altitude: 10 });
            expect(getMoonScore(100, -10)).toEqual({ total: 10, illumination: 10, altitude: 10 });
        });

        it("should return 10 when the moon is exactly on the horizon, regardless of illumination", () => {
            expect(getMoonScore(0, 0)).toEqual({ total: 10, illumination: 10, altitude: 10 });
            expect(getMoonScore(50, 0)).toEqual({ total: 10, illumination: 10, altitude: 10 });
            expect(getMoonScore(100, 0)).toEqual({ total: 10, illumination: 10, altitude: 10 });
        });

        it("should return 10 when the moon is not illuminated, regardless of altitude", () => {
            expect(getMoonScore(0, 0)).toEqual({ total: 10, illumination: 10, altitude: 10 });
            expect(getMoonScore(0, 45)).toEqual({ total: 10, illumination: 10, altitude: 10 });
            expect(getMoonScore(0, 90)).toEqual({ total: 10, illumination: 10, altitude: 10 });
        });

        it("should return 0 when the moon is fully illuminated and directly overhead", () => {
            expect(getMoonScore(100, 90)).toEqual({ total: 0, illumination: 0, altitude: 0 });
        });

        it("should give a higher score when the moon is less illuminated", () => {
            const lowIllumination = getMoonScore(20, 45);
            const highIllumination = getMoonScore(80, 45);

            expect(lowIllumination.total).toBeGreaterThan(highIllumination.total);
        });

        it("should give a higher score when the moon is lower in the sky", () => {
            const lowMoon = getMoonScore(50, 10);
            const highMoon = getMoonScore(50, 80);

            expect(lowMoon.total).toBeGreaterThan(highMoon.total);
        });

        it("should combine illumination and altitude scores using the expected weights", () => {
            const illumination = 50;
            const altitude = 30;

            const illuminationScore = getMoonIlluminationScore(illumination);
            const altitudeScore = getMoonAltitudeScore(altitude);

            const expected = illuminationScore * 0.6 + altitudeScore * 0.4;

            expect(getMoonScore(illumination, altitude).total).toBe(expected);
        });

        it("should produce a monotonically decreasing score as moon illumination increases", () => {
            const illuminations = [0, 20, 40, 60, 80, 100];
            const scores = illuminations.map((illumination) => getMoonScore(illumination, 45));

            for (let i = 1; i < scores.length; i++) {
                expect(scores[i].total).toBeLessThan(scores[i - 1].total);
            }
        });

        it("should produce a monotonically decreasing score as moon altitude increases", () => {
            const altitudes = [1, 10, 20, 30, 45, 60, 75, 90];
            const scores = altitudes.map((altitude) => getMoonScore(50, altitude));

            for (let i = 1; i < scores.length; i++) {
                expect(scores[i].total).toBeLessThan(scores[i - 1].total);
            }
        });
    });

    describe("getMoonAltitudeScore", () => {
        it("should return 10 when the moon is below the horizon", () => {
            expect(getMoonAltitudeScore(-10)).toBe(10);
        });

        it("should return 10 when the moon is exactly on the horizon", () => {
            expect(getMoonAltitudeScore(0)).toBe(10);
        });

        it("should return 0 when the moon is directly overhead", () => {
            expect(getMoonAltitudeScore(90)).toBe(0);
        });

        it("should produce a monotonically decreasing score as altitude increases", () => {
            const altitudes = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

            const scores = altitudes.map(getMoonAltitudeScore);

            for (let i = 1; i < scores.length; i++) {
                expect(scores[i]).toBeLessThan(scores[i - 1]);
            }
        });

        it("should clamp altitudes greater than 90 to 90", () => {
            expect(getMoonAltitudeScore(120)).toBe(0);
        });

        it("should clamp altitudes less than -90 to -90", () => {
            expect(getMoonAltitudeScore(-120)).toBe(10);
        });
    });

    describe("calculateHourlyScore", () => {
        it("should calculate the correct weighted score when the moon is below the horizon", () => {
            const cloudCoverage = 50;
            const moonIllumination = 20;
            const moonAltitude = -10;

            const result = calculateHourlyScore(cloudCoverage, moonIllumination, moonAltitude);

            const expected =
                5 * (CLOUD_WEIGHT / 10) + // clouds (50% coverage → score 5)
                10 * (MOON_WEIGHT / 10); // moon below horizon → score 10

            expect(result.total).toBe(expected);
        });

        it("should calculate the correct weighted score when the moon is above the horizon", () => {
            const cloudCoverage = 50;
            const moonIllumination = 20;
            const moonAltitude = 30;

            const cloudScore = getCloudScore(cloudCoverage);
            const moonScore = getMoonScore(moonIllumination, moonAltitude);

            const expected =
                Math.round(
                    (cloudScore * (CLOUD_WEIGHT / 10) + moonScore.total * (MOON_WEIGHT / 10)) * 10,
                ) / 10;

            const result = calculateHourlyScore(cloudCoverage, moonIllumination, moonAltitude);

            expect(result.total).toBe(expected);
        });

        it("should give a higher score when the moon is lower in the sky", () => {
            const cloudCoverage = 50;
            const moonIllumination = 50;

            const lowMoon = calculateHourlyScore(cloudCoverage, moonIllumination, 10);

            const highMoon = calculateHourlyScore(cloudCoverage, moonIllumination, 80);

            expect(lowMoon.total).toBeGreaterThan(highMoon.total);
        });

        it("should give a higher score when the moon is less illuminated", () => {
            const cloudCoverage = 50;
            const moonAltitude = 45;

            const lowIllumination = calculateHourlyScore(cloudCoverage, 20, moonAltitude);

            const highIllumination = calculateHourlyScore(cloudCoverage, 80, moonAltitude);

            expect(lowIllumination.total).toBeGreaterThan(highIllumination.total);
        });

        it("should calculate the correct cloud and moon breakdown", () => {
            const cloudCoverage = 50;
            const moonIllumination = 20;
            const moonAltitude = 30;

            const result = calculateHourlyScore(cloudCoverage, moonIllumination, moonAltitude);

            const expectedCloudScore = getCloudScore(cloudCoverage);
            const expectedMoonScore = getMoonScore(moonIllumination, moonAltitude);

            expect(result.breakdown.cloud).toBe(expectedCloudScore * (CLOUD_WEIGHT / 10));
            expect(result.breakdown.moon.total).toBe(expectedMoonScore.total * (MOON_WEIGHT / 10));
        });

        it("should return a maximum score with clear skies and the moon below the horizon", () => {
            const result = calculateHourlyScore(0, 100, -10);

            expect(result.total).toBe(10);
            expect(result.breakdown.cloud).toBe(6);
            expect(result.breakdown.moon.total).toBe(4);
        });

        it("should return a minimum score with full cloud cover and a full moon directly overhead", () => {
            const result = calculateHourlyScore(100, 100, 90);

            expect(result.total).toBe(0);
            expect(result.breakdown.cloud).toBe(0);
            expect(result.breakdown.moon.total).toBe(0);
        });
    });

    describe("getScoreSummary", () => {
        it("should return poor, given very cloudy skies", () => {
            expect(getScoreSummary(85, 10, 0)).toContain("heavy cloud");
        });

        it("should return very poor, given bright moon + clouds", () => {
            expect(getScoreSummary(70, 80, 90)).toContain("Very poor");
        });

        it("should return poor, given bright moon alone", () => {
            expect(getScoreSummary(10, 80, 90)).toContain("bright moon");
        });

        it("should return below average, given cloudy skies", () => {
            expect(getScoreSummary(65, 20, 0)).toContain("Below average");
        });

        it("should return excellent, given clear dark skies", () => {
            expect(getScoreSummary(10, 10, 0)).toContain("Excellent");
        });

        it("should return good, given mostly clear skies", () => {
            expect(getScoreSummary(30, 20, 0)).toContain("Good");
        });

        it("should return mixed conditions, given moderate moon and some clouds", () => {
            expect(getScoreSummary(50, 50, 90)).toContain("Mixed conditions");
        });
    });

    describe("getAstroScore", () => {
        // Astronomical Darkness: 20:30 - 04:00
        const sunset = mockDayData[0].sunset; // 2026-01-01T19:00:00Z
        const sunrise = mockDayData[1].sunrise; // 2026-01-02T05:30:00Z
        const moonIllumination = 50;

        it("should return a zero score when no dark hours are available", () => {
            const result = getAstroScore([], moonIllumination, sunset, sunrise, mockLat, mockLng);

            expect(result.currentScore).toBe(0);
            expect(result.currentBreakdown).toEqual({
                cloud: 0,
                moon: {
                    total: 0,
                    illumination: 0,
                    altitude: 0,
                },
            });
            expect(result.summary).toBe("No astronomical darkness during this period");
            expect(result.breakdownTime).toBe(0);
            expect(result.hourlyScores).toEqual([]);
            expect(result.primeTimeStart).toBeUndefined();
            expect(result.primeTimeEnd).toBeUndefined();
            expect(result.primeScore).toBeUndefined();
        });

        describe("hourly scoring", () => {
            it("should reflect cloud coverage in the hourly score", () => {
                const clear = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 10 }], // 21:00 - First hour that starts within astronomical darkness
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                const cloudy = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 90 }], // 21:00 - First hour that starts within astronomical darkness
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(clear.currentScore).toBeGreaterThan(cloudy.currentScore);
            });

            it("should reflect moon illumination in the hourly score", () => {
                const lowIllumination = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 20 }], // 21:00 - First hour that starts within astronomical darkness
                    10,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                const highIllumination = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 20 }], // 21:00 - First hour that starts within astronomical darkness
                    90,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(lowIllumination.currentScore).toBeGreaterThan(highIllumination.currentScore);
            });

            it("should reflect moon altitude in the hourly score", () => {
                getMoonPositionMock.mockReturnValue({
                    altitude: 10,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const lowMoon = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 20 }], // 21:00 - First hour that starts within astronomical darkness
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                getMoonPositionMock.mockReturnValue({
                    altitude: 80,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const highMoon = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 20 }], // 21:00 - First hour that starts within astronomical darkness
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(lowMoon.currentScore).toBeGreaterThan(highMoon.currentScore);
            });

            it("should give a perfect moon score when the moon is below the horizon", () => {
                getMoonPositionMock.mockReturnValue({
                    altitude: -10,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const result = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 0 }], // 21:00 - First hour that starts within astronomical darkness
                    100,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.currentBreakdown.moon.total).toBe(4);
            });
        });

        describe("current score", () => {
            it("should use the first dark hour as the current score", () => {
                const hourlyData = [
                    { dt: sunset + 2 * 3600, clouds: 10 }, // 21:00 - First hour that starts within astronomical darkness
                    { dt: sunset + 3 * 3600, clouds: 90 }, // 22:00
                ];

                const result = getAstroScore(
                    hourlyData,
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.currentScore).toBe(result.hourlyScores[0].score);
            });

            it("should use the first dark hour as the breakdown time", () => {
                const firstHour = sunset + 2 * 3600; // 21:00 - First hour that starts within astronomical darkness

                const result = getAstroScore(
                    [{ dt: firstHour, clouds: 20 }],
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.breakdownTime).toBe(firstHour);
            });
        });

        describe("single dark hour", () => {
            it("should exclude prime window", () => {
                const hour = sunset + 2 * 3600; // 21:00 - First hour that starts within astronomical darkness

                const result = getAstroScore(
                    [{ dt: hour, clouds: 20 }],
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.primeTimeStart).toBe(undefined);
                expect(result.primeTimeEnd).toBe(undefined);
                expect(result.primeScore).toBe(undefined);
            });
        });

        describe("prime time window", () => {
            it("should select the highest-scoring consecutive two-hour window", () => {
                const hourlyData = [
                    { dt: sunset + 2 * 3600, clouds: 90 }, // 21:00 - First hour that starts within astronomical darkness
                    { dt: sunset + 3 * 3600, clouds: 80 }, // 22:00
                    { dt: sunset + 4 * 3600, clouds: 10 }, // 23:00
                    { dt: sunset + 5 * 3600, clouds: 10 }, // 00:00
                    { dt: sunset + 6 * 3600, clouds: 90 }, // 01:00
                ];

                const result = getAstroScore(
                    hourlyData,
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.primeTimeStart).toBe(hourlyData[2].dt);
                expect(result.primeTimeEnd).toBe(hourlyData[4].dt);
            });

            it("should calculate prime score as the average of the two-hour window", () => {
                const hourlyData = [
                    { dt: sunset + 2 * 3600, clouds: 90 }, // 21:00 - First hour that starts within astronomical darkness
                    { dt: sunset + 3 * 3600, clouds: 80 }, // 22:00
                    { dt: sunset + 4 * 3600, clouds: 10 }, // 23:00
                ];

                const result = getAstroScore(
                    hourlyData,
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                const firstScore = result.hourlyScores[1].score;
                const secondScore = result.hourlyScores[2].score;

                const expected = Math.round(((firstScore + secondScore) / 2) * 10) / 10;

                expect(result.primeScore).toBe(expected);
            });

            it("should select the earliest window when two windows have equal scores", () => {
                const hourlyData = [
                    { dt: sunset + 2 * 3600, clouds: 20 }, // 21:00 - First hour that starts within astronomical darkness
                    { dt: sunset + 3 * 3600, clouds: 20 }, // 22:00
                    { dt: sunset + 4 * 3600, clouds: 20 }, // 23:00
                    { dt: sunset + 5 * 3600, clouds: 20 }, // 00:00
                    { dt: sunset + 6 * 3600, clouds: 20 }, // 01:00
                ];

                const result = getAstroScore(
                    hourlyData,
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.primeTimeStart).toBe(hourlyData[0].dt);
                expect(result.primeTimeEnd).toBe(hourlyData[2].dt);
            });

            it("should return a two-hour prime-time window", () => {
                const hourlyData = [
                    { dt: sunset + 2 * 3600, clouds: 20 }, // 21:00 - First hour that starts within astronomical darkness
                    { dt: sunset + 3 * 3600, clouds: 20 }, // 22:00
                ];

                const result = getAstroScore(
                    hourlyData,
                    moonIllumination,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.primeTimeEnd! - result.primeTimeStart!).toBe(7200);
            });
        });

        describe("summary", () => {
            it("should generate a summary using the first dark hour", () => {
                getMoonPositionMock.mockReturnValue({
                    altitude: -10,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const result = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 10 }], // 21:00 - First hour that starts within astronomical darkness
                    10,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.summary).toContain("Excellent");
            });

            it("should generate a poor summary for very cloudy conditions", () => {
                const result = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 90 }], // 21:00 - First hour that starts within astronomical darkness
                    10,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.summary).toContain("heavy cloud");
            });

            it("should account for moon altitude when generating the summary", () => {
                getMoonPositionMock.mockReturnValue({
                    altitude: 80,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const result = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 10 }], // 21:00 - First hour that starts within astronomical darkness
                    80,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.summary).toContain("bright moon");
            });
        });

        describe("boundary conditions", () => {
            it("should handle a moon exactly on the horizon", () => {
                getMoonPositionMock.mockReturnValue({
                    altitude: 0,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const result = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 0 }], // 21:00 - First hour that starts within astronomical darkness
                    100,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.currentBreakdown.moon.total).toBe(4);
            });

            it("should handle a moon directly overhead", () => {
                getMoonPositionMock.mockReturnValue({
                    altitude: 90,
                    azimuth: 0,
                    distance: 0,
                    parallacticAngle: 0,
                });

                const result = getAstroScore(
                    [{ dt: sunset + 2 * 3600, clouds: 0 }], // 21:00 - First hour that starts within astronomical darkness
                    100,
                    sunset,
                    sunrise,
                    mockLat,
                    mockLng,
                );

                expect(result.currentBreakdown.moon.total).toBe(0);
            });
        });
    });
});
