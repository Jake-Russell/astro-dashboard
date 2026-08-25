import { getMoonPosition } from "suncalc";
import type { AstroScoreResult } from "molecules";

const ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS = 90 * 60; // 90 minutes in seconds
export const CLOUD_WEIGHT = 6;
export const MOON_WEIGHT = 4;
const WINDOW_SIZE = 2;

export const getCloudScore = (cloudCoverage: number): number => {
    const score = 10 * (1 - cloudCoverage / 100);
    return Math.max(0, Math.min(10, score));
};

export const getMoonIlluminationScore = (illumination: number): number => {
    const score = 10 * (1 - illumination / 100);
    return Math.max(0, Math.min(10, score));
};

export const getMoonAltitudeScore = (altitude: number): number => {
    const clampedAltitude = Math.max(-90, Math.min(90, altitude));

    if (clampedAltitude <= 0) return 10;

    const altitudeRadians = (clampedAltitude * Math.PI) / 180;
    const altitudeImpact = Math.sin(altitudeRadians);

    return 10 * (1 - altitudeImpact);
};

export const getMoonScore = (illumination: number, altitude: number): number => {
    if (altitude <= 0) return 10;

    const illuminationScore = getMoonIlluminationScore(illumination);
    if (illumination === 0) return 10;

    const altitudeScore = getMoonAltitudeScore(altitude);

    return illuminationScore * 0.6 + altitudeScore * 0.4;
};

export const calculateHourlyScore = (
    cloudCoverage: number,
    moonIllumination: number,
    moonAltitude: number,
) => {
    const cloudScore = getCloudScore(cloudCoverage);
    const moonScore = getMoonScore(moonIllumination, moonAltitude);

    const cloudWeighted = cloudScore * (CLOUD_WEIGHT / 10);
    const moonWeighted = moonScore * (MOON_WEIGHT / 10);

    const total = cloudWeighted + moonWeighted;

    return {
        total: Math.round(total * 10) / 10,
        breakdown: {
            cloud: cloudWeighted,
            moon: moonWeighted,
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
    moonAltitude: number,
): string => {
    const veryCloudy = cloudCoverage > 80;
    const cloudy = cloudCoverage > 60;
    const moonUp = moonAltitude > 0;
    const brightMoon = moonUp && moonIllumination > 60;
    const moderateMoon = moonUp && moonIllumination > 30;

    if (veryCloudy) return "Poor — heavy cloud cover dominates the sky";
    if (brightMoon && cloudy) return "Very poor — bright moon and clouds limit visibility";
    if (brightMoon) return "Poor — bright moon reduces dark sky contrast";
    if (cloudy) return "Below average — clouds reducing clarity";
    if (cloudCoverage < 20 && !moonUp) return "Excellent — clear, dark sky conditions";
    if (cloudCoverage < 40 && !moderateMoon) return "Good — mostly clear with mild interference";

    return "Mixed conditions — some visibility limitations";
};

export const getAstroScore = (
    hourlyData: Array<{ dt: number; clouds: number }>,
    moonIllumination: number,
    sunset: number,
    sunrise: number,
    latitude: number,
    longitude: number,
): AstroScoreResult => {
    const { darkStart, darkEnd } = getAstronomicalDarknessWindow(sunset, sunrise);

    // Filter to hours that fall completely within darkness (from hour start to hour end)
    const darkHours = hourlyData.filter((hour) => {
        const hourStart = hour.dt;
        const hourEnd = hour.dt + 3600;
        return hourStart >= darkStart && hourEnd <= darkEnd;
    });

    const hourlyScores = darkHours.map((hour) => {
        const moonPos = getMoonPosition(new Date(hour.dt * 1000), latitude, longitude);
        const result = calculateHourlyScore(hour.clouds, moonIllumination, moonPos.altitude);

        return {
            time: hour.dt,
            score: result.total,
            breakdown: result.breakdown,
            cloudCoverage: hour.clouds,
            moonAltitude: moonPos.altitude,
        };
    });

    if (hourlyScores.length === 0) {
        return {
            currentScore: 0,
            currentBreakdown: { cloud: 0, moon: 0 },
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
            summary: getScoreSummary(single.cloudCoverage, moonIllumination, single.moonAltitude),
            breakdownTime: single.time,
            hourlyScores,
            primeTimeStart: single.time,
            primeTimeEnd: Math.min(single.time + 3600, darkEnd),
            primeScore: single.score,
        };
    }

    const current = hourlyScores[0];
    const primeTimeStart = hourlyScores[bestWindow.start].time;
    const rawEnd = hourlyScores[bestWindow.end].time + 3600;
    const primeTimeEnd = Math.min(rawEnd, darkEnd);

    return {
        currentScore: current.score,
        currentBreakdown: current.breakdown,
        summary: getScoreSummary(current.cloudCoverage, moonIllumination, current.moonAltitude),
        breakdownTime: current.time,
        hourlyScores,
        primeTimeStart,
        primeTimeEnd,
        primeScore: Math.round(bestWindow.avgScore * 10) / 10,
    };
};
