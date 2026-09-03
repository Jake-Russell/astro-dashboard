"use client";
import { type FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getFormattedTime } from "utils/timeUtils";
import type { NightScoreChartProps } from "./types";

import "./NightScoreChart.css";

const BASE_CHART_WIDTH = 400; // floor width so short nights still fill the container
const MIN_COLUMN_WIDTH = 60; // minimum width per hour, keeps hit-rects tap-friendly
const CHART_HEIGHT = 150;
const PADDING_X = 24;
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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const chart = useMemo(() => {
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
            chartWidth,
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

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateScrollState();
        window.addEventListener("resize", updateScrollState);
        return () => window.removeEventListener("resize", updateScrollState);
    }, [updateScrollState, chart?.chartWidth]);

    if (!chart) return null;

    const activePoint = activeIndex !== undefined ? chart.points[activeIndex] : undefined;

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="w-full overflow-x-auto pb-4"
                onScroll={updateScrollState}
            >
                <div className="relative" style={{ width: chart.chartWidth, minWidth: "100%" }}>
                    <svg
                        viewBox={`0 0 ${chart.chartWidth} ${CHART_HEIGHT}`}
                        className="w-full h-auto"
                        role="group"
                        aria-label={`Stargazing score from ${chart.startLabel} to ${chart.endLabel}`}
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="nightScoreFill" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="0%"
                                    stopColor="var(--accent-primary)"
                                    stopOpacity="0.35"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--accent-primary)"
                                    stopOpacity="0"
                                />
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
                                    x2={chart.chartWidth - PADDING_X}
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
                            className="night-score-chart-line"
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
                                className="night-score-chart-active-line"
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
                                    className={`night-score-chart-dot ${isActive ? "active" : ""}`}
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
                                left: `${(activePoint.x / chart.chartWidth) * 100}%`,
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
            </div>

            {/* Right edge fade + chevron — signals more content to scroll to */}
            {canScrollRight && (
                <div
                    className="pointer-events-none absolute right-0 top-0 bottom-6 w-14 flex items-center justify-end pr-1"
                    style={{
                        background:
                            "linear-gradient(to left, var(--card-bg) 15%, transparent 100%)",
                    }}
                    aria-hidden="true"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-(--text-secondary)"
                    >
                        <path
                            d="M9 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            {/* Left edge fade + chevron — only shown once scrolled away from the start */}
            {canScrollLeft && (
                <div
                    className="pointer-events-none absolute left-0 top-0 bottom-6 w-14 flex items-center justify-start pl-1"
                    style={{
                        background:
                            "linear-gradient(to right, var(--card-bg) 15%, transparent 100%)",
                    }}
                    aria-hidden="true"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-(--text-secondary)"
                    >
                        <path
                            d="M15 6l-6 6 6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};
