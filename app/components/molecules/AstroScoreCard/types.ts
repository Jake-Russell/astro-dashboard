import type { HourData } from "api/weather/types";
import type { GeoPosition } from "services/geolocationService";

export type AstroScoreCardProps = GeoPosition & {
    moonPhase: number;
    forecastStart: number;
    forecastEnd: number;
    nightHours: HourData[];
    onAnnouncement?: (announcement: string) => void;
};

export type MoonScoreBreakdown = {
    total: number;
    illumination: number;
    altitude: number;
};

export type ScoreBreakdown = {
    cloud: number;
    moon: MoonScoreBreakdown;
};

export type HourlyAstroScore = {
    time: number;
    score: number;
    breakdown: ScoreBreakdown;
    cloudCoverage: number;
    moonAltitude: number;
};

export type AstroScoreResult = {
    currentScore: number;
    currentBreakdown: ScoreBreakdown;
    summary: string;
    breakdownTime: number;
    hourlyScores: HourlyAstroScore[];
    primeTimeStart?: number;
    primeTimeEnd?: number;
    primeScore?: number;
};
