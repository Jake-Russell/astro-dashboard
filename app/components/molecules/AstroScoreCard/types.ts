import type { HourData } from "api/weather/types";
import type { GeoPosition } from "services/geolocationService";

export type AstroScoreCardProps = GeoPosition & {
    moonriseToday: number;
    moonsetToday: number;
    moonsetTomorrow: number;
    moonPhase: number;
    nightStart: number;
    nightEnd: number;
    nightHours: HourData[];
};

type HourlyAstroScore = {
    time: number;
    score: number;
    cloudCoverage: number;
    moonUp: boolean;
};

export type AstroScoreResult = {
    currentScore: number;
    currentBreakdown: {
        cloud: number;
        moon: number;
    };
    summary: string;
    breakdownTime: number;
    hourlyScores: HourlyAstroScore[];
    primeTimeStart?: number;
    primeTimeEnd?: number;
    primeScore?: number;
};
