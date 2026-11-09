import { type FunctionComponent } from "react";
import { getFormattedTime } from "utils/timeUtils";
import {
    CHART_HEIGHT,
    getActiveHighlightPath,
    MAX_SCORE,
    PADDING_X,
    PADDING_Y,
    SCORE_TICKS,
} from "./chartGeometry";
import { NightScoreChartSvgProps } from "./types";

export const NightScoreChartSvg: FunctionComponent<NightScoreChartSvgProps> = ({
    chart,
    activeIndex,
    gradientId,
    latitude,
    longitude,
    onActivate,
    onDeactivate,
}) => {
    const activeHighlightPath = getActiveHighlightPath(chart, activeIndex);

    return (
        <svg
            viewBox={`0 0 ${chart.chartWidth} ${CHART_HEIGHT}`}
            className="w-full h-auto"
            role="group"
            aria-label={`Stargazing score from ${chart.startLabel} to ${chart.endLabel}`}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                </linearGradient>
            </defs>

            {SCORE_TICKS.map((gridScore) => {
                const y =
                    PADDING_Y + chart.usableHeight - (gridScore / MAX_SCORE) * chart.usableHeight;
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

            {chart.primeRect && (
                <rect
                    x={chart.primeRect.x}
                    y={PADDING_Y}
                    width={chart.primeRect.width}
                    height={chart.usableHeight}
                    fill="rgb(34 197 94 / 0.12)"
                />
            )}

            {[...chart.points.map((point) => point.rangeX), chart.chartWidth - PADDING_X].map(
                (x, index) => (
                    <line
                        key={`hour-line-${index}`}
                        x1={x}
                        x2={x}
                        y1={PADDING_Y}
                        y2={PADDING_Y + chart.usableHeight}
                        stroke="var(--card-border)"
                        strokeWidth={0.5}
                    />
                ),
            )}

            <path d={chart.areaPath} fill={`url(#${gradientId})`} />
            <path
                d={chart.linePath}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth={1}
                className="night-score-chart-line"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

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

            {chart.points.map((point) => (
                <rect
                    key={`hit-${point.hour.time}`}
                    x={point.rangeX}
                    y={PADDING_Y}
                    width={point.rangeWidth}
                    height={chart.usableHeight}
                    fill="transparent"
                    className="cursor-pointer outline-none"
                    tabIndex={0}
                    role="button"
                    aria-label={`${getFormattedTime(point.hour.time, latitude, longitude)} to ${getFormattedTime(point.hour.endTime, latitude, longitude)}, score ${point.hour.score} out of 10`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onActivate(point.index);
                    }}
                    onMouseEnter={() => onActivate(point.index)}
                    onMouseLeave={onDeactivate}
                    onFocus={() => onActivate(point.index)}
                    onBlur={onDeactivate}
                />
            ))}

            {chart.points.map((point) => {
                const isActive = activeIndex === point.index;
                return (
                    <circle
                        key={point.hour.time}
                        cx={point.x}
                        cy={point.y}
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
    );
};
