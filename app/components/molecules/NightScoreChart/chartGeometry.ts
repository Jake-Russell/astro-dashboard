import type { HourlyAstroScore } from "../AstroScoreCard";
import { getFormattedTime } from "../../../utils/timeUtils";
import type { NightScoreChartData } from "./types";

export const BASE_CHART_WIDTH = 400;
export const MIN_COLUMN_WIDTH = 60;
export const CHART_HEIGHT = 150;
export const PADDING_X = 24;
export const PADDING_Y = 8;
export const MAX_SCORE = 10;
export const SCORE_TICKS = [0, 2, 4, 6, 8, 10];

export const buildNightScoreChart = (
    hourlyScores: HourlyAstroScore[],
    primeTimeStart: number | undefined,
    primeTimeEnd: number | undefined,
    latitude: number,
    longitude: number,
): NightScoreChartData | undefined => {
    if (hourlyScores.length === 0) return undefined;

    const chartWidth = Math.max(
        BASE_CHART_WIDTH,
        hourlyScores.length * MIN_COLUMN_WIDTH + PADDING_X * 2,
    );
    const firstTime = hourlyScores[0].time;
    const lastTime = hourlyScores[hourlyScores.length - 1].endTime;
    const timeSpan = Math.max(lastTime - firstTime, 1);
    const usableWidth = chartWidth - PADDING_X * 2;
    const usableHeight = CHART_HEIGHT - PADDING_Y * 2;
    const xForTime = (time: number) => PADDING_X + ((time - firstTime) / timeSpan) * usableWidth;
    const yForScore = (score: number) =>
        PADDING_Y + usableHeight - (Math.min(score, MAX_SCORE) / MAX_SCORE) * usableHeight;

    const points = hourlyScores.map((hour, index) => {
        const midTime = (hour.time + hour.endTime) / 2;
        return {
            index,
            x: xForTime(midTime),
            y: yForScore(hour.score),
            rangeX: xForTime(hour.time),
            rangeWidth: xForTime(hour.endTime) - xForTime(hour.time),
            hour,
        };
    });

    const linePath = points
        .map(
            (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
        )
        .join(" ");
    const baseline = (PADDING_Y + usableHeight).toFixed(1);
    const areaPath =
        `M ${points[0].x.toFixed(1)} ${baseline} ` +
        points.map((point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ") +
        ` L ${points[points.length - 1].x.toFixed(1)} ${baseline} Z`;
    const primeRect =
        primeTimeStart !== undefined && primeTimeEnd !== undefined
            ? {
                  x: xForTime(primeTimeStart),
                  width: xForTime(primeTimeEnd) - xForTime(primeTimeStart),
              }
            : undefined;

    return {
        points,
        linePath,
        areaPath,
        primeRect,
        usableHeight,
        chartWidth,
        startLabel: getFormattedTime(firstTime, latitude, longitude),
        endLabel: getFormattedTime(lastTime, latitude, longitude),
    };
};

export const getActiveHighlightPath = (
    chart: NightScoreChartData,
    activeIndex: number | undefined,
): string | undefined => {
    if (activeIndex === undefined) return undefined;

    const point = chart.points[activeIndex];
    if (!point) return undefined;

    const previous = chart.points[activeIndex - 1];
    const next = chart.points[activeIndex + 1];
    const interpolateY = (x: number, x1: number, y1: number, x2: number, y2: number) =>
        y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
    const leftX = previous ? point.rangeX : point.x;
    const leftY = previous
        ? interpolateY(point.rangeX, previous.x, previous.y, point.x, point.y)
        : point.y;
    const rightX = next ? point.rangeX + point.rangeWidth : point.x;
    const rightY = next
        ? interpolateY(point.rangeX + point.rangeWidth, point.x, point.y, next.x, next.y)
        : point.y;

    return `M ${leftX.toFixed(1)} ${leftY.toFixed(1)} L ${point.x.toFixed(1)} ${point.y.toFixed(1)} L ${rightX.toFixed(1)} ${rightY.toFixed(1)}`;
};
