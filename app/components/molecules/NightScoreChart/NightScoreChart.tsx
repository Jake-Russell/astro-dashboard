"use client";
import { type FunctionComponent, useMemo, useState } from "react";
import { getFormattedTime } from "utils/timeUtils";
import type { NightScoreChartProps } from "./types";

const CHART_WIDTH = 400;
const CHART_HEIGHT = 100;
const PADDING_X = 16;
const PADDING_Y = 8;
const MAX_SCORE = 10;

export const NightScoreChart: FunctionComponent<NightScoreChartProps> = ({
    hourlyScores,
    primeTimeStart,
    primeTimeEnd,
    latitude,
    longitude,
}) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const chart = useMemo(() => {
        if (hourlyScores.length === 0) return undefined;

        const firstTime = hourlyScores[0].time;
        const lastTime = hourlyScores[hourlyScores.length - 1].endTime;
        const timeSpan = Math.max(lastTime - firstTime, 1);

        const usableWidth = CHART_WIDTH - PADDING_X * 2;
        const usableHeight = CHART_HEIGHT - PADDING_Y * 2;

        const xForTime = (time: number) =>
            PADDING_X + ((time - firstTime) / timeSpan) * usableWidth;

        const yForScore = (score: number) =>
            PADDING_Y + usableHeight - (Math.min(score, MAX_SCORE) / MAX_SCORE) * usableHeight;

        const points = hourlyScores.map((hour, index) => {
            const midTime = (hour.time + hour.endTime) / 2;
            return {
                index,
                x: xForTime(midTime),
                y: yForScore(hour.score),
                // Hit-region bounds for this hour's full range, used for hover/tooltip
                rangeX: xForTime(hour.time),
                rangeWidth: xForTime(hour.endTime) - xForTime(hour.time),
                hour,
            };
        });

        const linePath = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
            .join(" ");

        const baseline = (PADDING_Y + usableHeight).toFixed(1);
        const areaPath =
            `M ${points[0].x.toFixed(1)} ${baseline} ` +
            points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
            ` L ${points[points.length - 1].x.toFixed(1)} ${baseline} Z`;

        const primeRect =
            primeTimeStart && primeTimeEnd
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
            startLabel: getFormattedTime(firstTime, latitude, longitude),
            endLabel: getFormattedTime(lastTime, latitude, longitude),
        };
    }, [hourlyScores, primeTimeStart, primeTimeEnd, latitude, longitude]);

    // Path for the highlighted segment of the active hour, following the actual
    // slope of the line on either side of the dot rather than a flat line.
    const activeHighlightPath = useMemo(() => {
        if (!chart || activeIndex === undefined) return undefined;

        const { points } = chart;
        const p = points[activeIndex];
        const prev = points[activeIndex - 1];
        const next = points[activeIndex + 1];

        const interpolateY = (x: number, x1: number, y1: number, x2: number, y2: number) =>
            y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);

        const leftX = prev ? p.rangeX : p.x;
        const leftY = prev ? interpolateY(p.rangeX, prev.x, prev.y, p.x, p.y) : p.y;

        const rightX = next ? p.rangeX + p.rangeWidth : p.x;
        const rightY = next ? interpolateY(p.rangeX + p.rangeWidth, p.x, p.y, next.x, next.y) : p.y;

        return `M ${leftX.toFixed(1)} ${leftY.toFixed(1)} L ${p.x.toFixed(1)} ${p.y.toFixed(1)} L ${rightX.toFixed(1)} ${rightY.toFixed(1)}`;
    }, [chart, activeIndex]);

    if (!chart) return null;

    const activePoint = activeIndex !== undefined ? chart.points[activeIndex] : undefined;

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="w-full h-auto"
                role="group"
                aria-label={`Stargazing score from ${chart.startLabel} to ${chart.endLabel}`}
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="nightScoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 2.5, 5, 7.5, 10].map((gridScore) => {
                    const y =
                        PADDING_Y +
                        chart.usableHeight -
                        (gridScore / MAX_SCORE) * chart.usableHeight;
                    return (
                        <line
                            key={gridScore}
                            x1={PADDING_X}
                            x2={CHART_WIDTH - PADDING_X}
                            y1={y}
                            y2={y}
                            stroke="var(--card-border)"
                            strokeWidth={0.5}
                        />
                    );
                })}

                {/* Prime Time Rectangle */}
                {chart.primeRect && (
                    <rect
                        x={chart.primeRect.x}
                        y={PADDING_Y}
                        width={chart.primeRect.width}
                        height={chart.usableHeight}
                        fill="rgb(34 197 94 / 0.12)"
                    />
                )}

                {/* Area and Line Paths */}
                <path d={chart.areaPath} fill="url(#nightScoreFill)" />
                <path
                    d={chart.linePath}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth={1}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {/* Highlighted segment for the active hour's range, angled to match the line */}
                {activeHighlightPath && (
                    <path
                        d={activeHighlightPath}
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth={2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        pointerEvents="none"
                    />
                )}

                {/* Per-hour range hit areas — cover the full hour's time span, not just the point */}
                {chart.points.map((p) => (
                    <rect
                        key={`hit-${p.hour.time}`}
                        x={p.rangeX}
                        y={PADDING_Y}
                        width={p.rangeWidth}
                        height={chart.usableHeight}
                        fill="transparent"
                        className="cursor-pointer outline-none"
                        tabIndex={0}
                        role="button"
                        aria-label={`${getFormattedTime(p.hour.time, latitude, longitude)} to ${getFormattedTime(p.hour.endTime, latitude, longitude)}, score ${p.hour.score} out of 10`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex(p.index);
                        }}
                        onMouseEnter={() => setActiveIndex(p.index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        onFocus={() => setActiveIndex(p.index)}
                        onBlur={() => setActiveIndex(undefined)}
                    />
                ))}

                {/* Per-hour midpoint dots — visual marker only, hover handled by the range rects above */}
                {chart.points.map((p) => {
                    const isActive = activeIndex === p.index;
                    return (
                        <circle
                            key={p.hour.time}
                            cx={p.x}
                            cy={p.y}
                            r={isActive ? 3.5 : 1.5}
                            fill="var(--accent-primary)"
                            opacity={isActive ? 1 : 0.4}
                            style={{ transition: "r 120ms ease, opacity 120ms ease" }}
                            pointerEvents="none"
                        />
                    );
                })}
            </svg>

            {activePoint && (
                <div
                    className="absolute pointer-events-none px-2 py-1 rounded-md bg-(--card-bg) border border-(--card-border) shadow-sm text-xs whitespace-nowrap z-10"
                    style={{
                        left: `${(activePoint.x / CHART_WIDTH) * 100}%`,
                        top: `${(activePoint.y / CHART_HEIGHT) * 100}%`,
                        transform: "translate(-50%, calc(-100% - 24px))",
                    }}
                    data-testid="night-score-chart-tooltip"
                >
                    <p className="font-semibold text-foreground">
                        {getFormattedTime(activePoint.hour.time, latitude, longitude)}
                        {" - "}
                        {getFormattedTime(activePoint.hour.endTime, latitude, longitude)}
                    </p>
                    <p className="text-center text-(--text-secondary)">
                        {activePoint.hour.score}/10
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center mt-1 px-4 text-xs text-(--text-secondary)">
                <span>{chart.startLabel}</span>
                {chart.primeRect && (
                    <span className="flex items-center gap-1">
                        <span
                            className="inline-block w-2 h-2 rounded-full bg-green-500/60"
                            aria-hidden="true"
                        />
                        Prime window
                    </span>
                )}
                <span>{chart.endLabel}</span>
            </div>
        </div>
    );
};
