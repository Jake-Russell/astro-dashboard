import type { HourlyAstroScore } from "molecules/AstroScoreCard";
import type { GeoPosition } from "services/geolocationService";

export type NightScoreChartProps = GeoPosition & {
    hourlyScores: HourlyAstroScore[];
    primeTimeStart?: number;
    primeTimeEnd?: number;
};
