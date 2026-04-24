import { HourData } from "api/weather/route";
import { BaseCardProps } from "molecules/types";

export type AstroScoreCardProps = BaseCardProps & {
    moonriseToday: number;
    moonsetToday: number;
    moonsetTomorrow: number;
    moonPhase: number;
    sunsetToday: number;
    sunriseTomorrow: number;
    hourlyForecast: HourData[];
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
        moonIllumination: number;
        moonVisibility: number;
    };
    summary: string;
    breakdownTime: number;
    hourlyScores: HourlyAstroScore[];
    primeTimeStart?: number;
    primeTimeEnd?: number;
    primeScore?: number;
};
