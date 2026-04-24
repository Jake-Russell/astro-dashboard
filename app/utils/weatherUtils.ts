import { AstroScoreResult } from "molecules/AstroScoreCard/types";
import { isBodyUp } from "./timeUtils";

const ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS = 90 * 60; // 90 minutes in seconds
const CLOUD_COVERAGE_WEIGHT = 0.5;
const MOON_ILLUMINATION_WEIGHT = 0.3;
const MOON_VISIBILITY_WEIGHT = 0.2;
const WINDOW_SIZE = 2;

export const getCloudScore = (cloudCoverage: number): number => {
    const score = 10 * (1 - cloudCoverage / 100);
    return Math.max(0, Math.min(10, score));
};

export const getMoonIlluminationScore = (illumination: number): number => {
    const score = 10 * (1 - illumination / 100);
    return Math.max(0, Math.min(10, score));
};

export const getMoonVisibilityScore = (moonUp: boolean): number => {
    return moonUp ? 0 : 10;
};

export const calculateHourlyScore = (
    cloudCoverage: number,
    moonIllumination: number,
    moonUp: boolean,
) => {
    const cloudScore = getCloudScore(cloudCoverage);
    const illuminationScore = getMoonIlluminationScore(moonIllumination);
    const moonVisScore = getMoonVisibilityScore(moonUp);

    const cloudWeighted = cloudScore * CLOUD_COVERAGE_WEIGHT;
    const illuminationWeighted = illuminationScore * MOON_ILLUMINATION_WEIGHT;
    const moonVisWeighted = moonVisScore * MOON_VISIBILITY_WEIGHT;

    const total = cloudWeighted + illuminationWeighted + moonVisWeighted;

    return {
        total: Math.round(total * 10) / 10,
        breakdown: {
            cloud: cloudWeighted,
            moonIllumination: illuminationWeighted,
            moonVisibility: moonVisWeighted,
        },
    };
};

export const getAstronomicalDarknessWindow = (sunset: number, sunrise: number) => {
    return {
        darkStart: sunset + ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS,
        darkEnd: sunrise - ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS,
    };
};

export const getScoreSummary = (
    cloudCoverage: number,
    moonIllumination: number,
    moonUp: boolean,
): string => {
    const veryCloudy = cloudCoverage > 80;
    const cloudy = cloudCoverage > 60;

    const brightMoon = moonUp && moonIllumination > 60;
    const moderateMoon = moonUp && moonIllumination > 30;

    if (veryCloudy) return "Poor — heavy cloud cover dominates the sky";
    if (brightMoon && cloudy) return "Very poor — bright moon and clouds limit visibility";
    if (brightMoon) return "Poor — bright moon reduces dark sky contrast";

    if (cloudy) return "Below average — clouds reducing clarity";

    if (cloudCoverage < 20 && !moonUp) {
        return "Excellent — clear, dark sky conditions";
    }

    if (cloudCoverage < 40 && !moderateMoon) {
        return "Good — mostly clear with mild interference";
    }

    return "Mixed conditions — some visibility limitations";
};

export const getAstroScore = (
    hourlyData: Array<{ dt: number; clouds: number }>,
    moonIllumination: number,
    moonrise: number,
    moonset: number,
    sunset: number,
    sunrise: number,
    latitude: number,
    longitude: number,
): AstroScoreResult => {
    const { darkStart, darkEnd } = getAstronomicalDarknessWindow(sunset, sunrise);

    const darkHours = hourlyData.filter((hour) => {
        const hourMid = hour.dt + 1800; // +30 minutes
        return hourMid >= darkStart && hourMid < darkEnd;
    });

    const hourlyScores = darkHours.map((hour) => {
        const isMoonUp = isBodyUp(moonrise, moonset, latitude, longitude, hour.dt);
        const result = calculateHourlyScore(hour.clouds, moonIllumination, isMoonUp);

        return {
            time: hour.dt,
            score: result.total,
            breakdown: result.breakdown,
            cloudCoverage: hour.clouds,
            moonUp: isMoonUp,
        };
    });

    if (hourlyScores.length === 0) {
        return {
            currentScore: 0,
            currentBreakdown: {
                cloud: 0,
                moonIllumination: 0,
                moonVisibility: 0,
            },
            summary: "No astronomical darkness during this period",
            breakdownTime: 0,
            hourlyScores: [],
            primeTimeStart: undefined,
            primeTimeEnd: undefined,
            primeScore: undefined,
        };
    }

    let bestWindow = { start: 0, end: 0, avgScore: -1 };

    if (hourlyScores.length >= WINDOW_SIZE) {
        for (let i = 0; i <= hourlyScores.length - WINDOW_SIZE; i++) {
            const window = hourlyScores.slice(i, i + WINDOW_SIZE);

            const avgScore = window.reduce((sum, h) => sum + h.score, 0) / WINDOW_SIZE;

            if (avgScore > bestWindow.avgScore)
                bestWindow = { start: i, end: i + WINDOW_SIZE - 1, avgScore };
        }
    } else {
        const single = hourlyScores[0];

        return {
            currentScore: single.score,
            currentBreakdown: single.breakdown,
            summary: getScoreSummary(single.cloudCoverage, moonIllumination, single.moonUp),
            breakdownTime: single.time,
            hourlyScores,
            primeTimeStart: single.time,
            primeTimeEnd: Math.min(single.time + 3600, darkEnd),
            primeScore: single.score,
        };
    }

    const current = hourlyScores[0];

    // Clamp end time so it never exceeds darkness
    const rawEnd = hourlyScores[bestWindow.end].time + 3600;
    const primeEnd = Math.min(rawEnd, darkEnd);

    return {
        currentScore: current.score,
        currentBreakdown: current.breakdown,
        summary: getScoreSummary(current.cloudCoverage, moonIllumination, current.moonUp),
        breakdownTime: current.time,
        hourlyScores,
        primeTimeStart: hourlyScores[bestWindow.start].time,
        primeTimeEnd: primeEnd,
        primeScore: Math.round(bestWindow.avgScore * 10) / 10,
    };
};
