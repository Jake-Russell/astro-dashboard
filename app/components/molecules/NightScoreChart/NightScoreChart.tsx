"use client";
import {
    Fragment,
    type FunctionComponent,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { getFormattedTime } from "utils/timeUtils";
import {
    buildNightScoreChart,
    CHART_HEIGHT,
    MAX_SCORE,
    PADDING_Y,
    SCORE_TICKS,
} from "./chartGeometry";
import { NightScoreChartSvg } from "./NightScoreChartSvg";
import type { NightScoreChartProps } from "./types";

import "./NightScoreChart.css";

export const NightScoreChart: FunctionComponent<NightScoreChartProps> = ({
    hourlyScores,
    primeTimeStart,
    primeTimeEnd,
    latitude,
    longitude,
}) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    const gradientId = useId();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const chart = useMemo(() => {
        return buildNightScoreChart(
            hourlyScores,
            primeTimeStart,
            primeTimeEnd,
            latitude,
            longitude,
        );
    }, [hourlyScores, primeTimeStart, primeTimeEnd, latitude, longitude]);

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
                    <div className="relative">
                        <NightScoreChartSvg
                            chart={chart}
                            activeIndex={activeIndex}
                            gradientId={gradientId}
                            latitude={latitude}
                            longitude={longitude}
                            onActivate={setActiveIndex}
                            onDeactivate={() => setActiveIndex(undefined)}
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 text-xs text-(--text-secondary)">
                            {SCORE_TICKS.map((gridScore) => {
                                const y =
                                    PADDING_Y +
                                    chart.usableHeight -
                                    (gridScore / MAX_SCORE) * chart.usableHeight;
                                return (
                                    <span
                                        key={`y-label-${gridScore}`}
                                        className="absolute right-1 -translate-y-1/2"
                                        style={{ top: `${(y / CHART_HEIGHT) * 100}%` }}
                                    >
                                        {gridScore}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tooltip */}
                    {activePoint && (
                        <div
                            className="absolute pointer-events-none px-2 py-1 rounded-md bg-(--card-bg) border border-(--card-border) shadow-sm text-xs whitespace-nowrap z-10"
                            style={{
                                left: `${(activePoint.x / chart.chartWidth) * 100}%`,
                                top: `${(activePoint.y / CHART_HEIGHT) * 100}%`,
                                transform: "translate(-50%, calc(-100% - 48px))",
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

                    <div className="relative mt-1 h-8 px-4 text-xs text-(--text-secondary)">
                        {chart.points.map((point, index) => (
                            <Fragment key={`label-${point.hour.time}`}>
                                <span
                                    className="absolute origin-top-left whitespace-nowrap"
                                    style={{
                                        left: `${(point.rangeX / chart.chartWidth) * 100}%`,
                                        transform: "translateX(-50%) rotate(0deg)",
                                    }}
                                >
                                    {getFormattedTime(point.hour.time, latitude, longitude)}
                                </span>
                                {index === chart.points.length - 1 && (
                                    <span
                                        className="absolute origin-top-left whitespace-nowrap"
                                        style={{
                                            left: `${((point.rangeX + point.rangeWidth) / chart.chartWidth) * 100}%`,
                                            transform: "translateX(-50%) rotate(0deg)",
                                        }}
                                    >
                                        {getFormattedTime(point.hour.endTime, latitude, longitude)}
                                    </span>
                                )}
                            </Fragment>
                        ))}
                    </div>

                    {chart.primeRect && (
                        <div className="flex h-4 items-center justify-center gap-1 text-xs text-(--text-secondary)">
                            <span
                                className="inline-block w-2 h-2 rounded-full bg-green-500/60"
                                aria-hidden="true"
                            />
                            Prime window
                        </div>
                    )}
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
