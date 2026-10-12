import type { HourlyAstroScore } from "molecules/AstroScoreCard";
import type { GeoPosition } from "services/geolocationService";

export type NightScoreChartProps = GeoPosition & {
    hourlyScores: HourlyAstroScore[];
    primeTimeStart?: number;
    primeTimeEnd?: number;
};

export type NightScorePoint = {
    index: number;
    x: number;
    y: number;
    rangeX: number;
    rangeWidth: number;
    hour: HourlyAstroScore;
};

export type NightScoreChartData = {
    points: NightScorePoint[];
    linePath: string;
    areaPath: string;
    primeRect?: { x: number; width: number };
    usableHeight: number;
    chartWidth: number;
    startLabel: string;
    endLabel: string;
};

export type NightScoreChartSvgProps = {
    chart: NightScoreChartData;
    activeIndex?: number;
    gradientId: string;
    latitude: number;
    longitude: number;
    onActivate: (index: number) => void;
    onDeactivate: () => void;
};
