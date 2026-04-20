import { WeatherResponse } from "api/weather/route";
import { BaseCardProps } from "molecules/types";

export type AstroScoreCardProps = BaseCardProps & {
    weatherData: WeatherResponse;
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
    hourlyScores: HourlyAstroScore[];
    primeTimeStart: number;
    primeTimeEnd: number;
    primeScore: number;
};
