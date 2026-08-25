"use client";
import { type FunctionComponent, useEffect } from "react";
import { Tile } from "atoms";
import { getMoonIllumination } from "utils/moonUtils";
import { getFormattedTime, isCurrentlyPrime } from "utils/timeUtils";
import { getAstroScore, CLOUD_WEIGHT, MOON_WEIGHT } from "utils/weatherUtils";
import type { AstroScoreCardProps } from "./types";

export const AstroScoreCard: FunctionComponent<AstroScoreCardProps> = ({
    latitude,
    longitude,
    moonPhase,
    forecastStart,
    forecastEnd,
    nightHours,
    onAnnouncement,
}) => {
    const moonIllumination = getMoonIllumination(moonPhase);

    const {
        currentScore,
        currentBreakdown,
        summary,
        breakdownTime,
        primeTimeStart,
        primeTimeEnd,
        primeScore,
        hourlyScores,
    } = getAstroScore(
        nightHours,
        moonIllumination,
        forecastStart,
        forecastEnd,
        latitude,
        longitude,
    );

    const primeStartTime = primeTimeStart
        ? getFormattedTime(primeTimeStart, latitude, longitude)
        : undefined;
    const primeEndTime = primeTimeEnd
        ? getFormattedTime(primeTimeEnd, latitude, longitude)
        : undefined;

    const isInPrimeWindow = isCurrentlyPrime(primeTimeStart, primeTimeEnd, latitude, longitude);

    const breakdownTimeFormatted =
        breakdownTime !== 0 ? getFormattedTime(breakdownTime, latitude, longitude) : undefined;

    useEffect(() => {
        if (nightHours.length === 0) {
            onAnnouncement?.(
                "A stargazing score is not available because there is no nighttime weather forecast data.",
            );
            return;
        }

        const announcement = `Astro score: ${currentScore} out of 10${
            breakdownTimeFormatted ? ` at ${breakdownTimeFormatted}` : ""
        }.${
            primeStartTime && primeEndTime && primeScore !== undefined
                ? ` Prime conditions are between ${primeStartTime} and ${primeEndTime}, with an expected average score of ${primeScore} out of 10.`
                : ""
        }`;

        onAnnouncement?.(announcement);
    }, [
        nightHours.length,
        currentScore,
        breakdownTimeFormatted,
        primeStartTime,
        primeEndTime,
        primeScore,
        onAnnouncement,
    ]);

    return (
        <Tile title="Star Grade">
            <div className="w-full">
                {nightHours.length === 0 ? (
                    <div role="status" className="py-8 px-4 text-center">
                        <div className="text-4xl mb-4" aria-hidden="true">
                            🌅
                        </div>

                        <h3 className="text-base font-semibold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent">
                            No stargazing forecast available
                        </h3>

                        <p className="mt-2 max-w-md mx-auto text-sm leading-relaxed text-(--text-secondary)">
                            There isn&apos;t enough nighttime weather data available to calculate a
                            stargazing score for this location.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <p className="text-3xl font-bold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent">
                                <span aria-hidden="true">🌙</span> Star Grade
                            </p>
                            <p className="text-sm text-(--text-secondary)">
                                Overall conditions for stargazing tonight
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-(--accent-primary) mb-1">
                                    {currentScore}
                                </p>
                                <p className="text-xs text-(--text-secondary) uppercase tracking-widest">
                                    out of 10
                                    {breakdownTimeFormatted ? ` at ${breakdownTimeFormatted}` : ""}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-(--text-secondary) text-center">{summary}</p>

                        {breakdownTimeFormatted && (
                            <div className="p-4 rounded-lg bg-(--card-bg) border border-(--card-border)">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest">
                                        Score Breakdown
                                    </h3>
                                    <p className="text-xs text-(--text-secondary)">
                                        {breakdownTimeFormatted}
                                    </p>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span>
                                                <span aria-hidden="true">☁️</span> Clouds
                                            </span>
                                            <span>
                                                {currentBreakdown.cloud.toFixed(1)} / {CLOUD_WEIGHT}
                                            </span>
                                        </div>

                                        <div
                                            aria-hidden="true"
                                            className="h-2 w-full bg-(--card-border) rounded"
                                        >
                                            <div
                                                className="h-2 bg-(--accent-primary) rounded transition-all"
                                                style={{
                                                    width: `${
                                                        (currentBreakdown.cloud / CLOUD_WEIGHT) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span>
                                                <span aria-hidden="true">🌕</span> Moon
                                            </span>
                                            <span>
                                                {currentBreakdown.moon.toFixed(1)} / {MOON_WEIGHT}
                                            </span>
                                        </div>

                                        <div
                                            aria-hidden="true"
                                            className="h-2 w-full bg-(--card-border) rounded"
                                        >
                                            <div
                                                className="h-2 bg-(--accent-secondary) rounded transition-all"
                                                style={{
                                                    width: `${
                                                        (currentBreakdown.moon / MOON_WEIGHT) * 100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {primeStartTime && primeEndTime && primeScore !== undefined && (
                            <div
                                className={`p-4 rounded-lg border ${
                                    isInPrimeWindow
                                        ? "bg-green-500/10 border-green-500/30"
                                        : "bg-(--accent-secondary)/10 border-(--accent-secondary)/30"
                                }`}
                            >
                                <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    <span aria-hidden="true">🌟</span> Prime Conditions (2 hour
                                    window)
                                </h3>
                                {isInPrimeWindow && (
                                    <p className="text-sm font-bold text-green-700 mb-2">
                                        <span aria-hidden="true">✨</span> Currently prime
                                        conditions!
                                    </p>
                                )}
                                <p className="text-sm text-(--text-primary) font-medium">
                                    Between {primeStartTime} and {primeEndTime}
                                </p>
                                <p className="text-xs text-(--text-secondary) mt-1">
                                    Expected average score: {primeScore} / 10
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 border-t border-(--card-border) pt-4">
                            <div className="p-4 rounded-lg bg-(--accent-primary)/5 border border-(--accent-primary)/20 hover:border-(--accent-primary)/40 transition-colors">
                                <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    Cloud Coverage
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-(--accent-primary)">
                                        {(
                                            nightHours.reduce((sum, h) => sum + h.clouds, 0) /
                                            nightHours.length
                                        ).toFixed(0)}
                                        %
                                    </span>
                                    <span className="text-sm text-(--text-secondary)">
                                        average tonight
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-(--accent-secondary)/5 border border-(--accent-secondary)/20 hover:border-(--accent-secondary)/40 transition-colors">
                                <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    Moon Illumination
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-(--accent-secondary)">
                                        {moonIllumination}%
                                    </span>
                                    <span className="text-sm text-(--text-secondary)">
                                        {moonIllumination < 50 ? (
                                            <>
                                                <span aria-hidden="true">🌑</span> Dark
                                            </>
                                        ) : (
                                            <>
                                                <span aria-hidden="true">🌕</span> Bright
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/40 mb-4">
                            <h3 className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-1">
                                <span aria-hidden="true">⚠️</span> Viewing Conditions
                            </h3>
                            <p className="text-sm text-(--text-secondary)">
                                For the best stargazing results, use a location with minimal light
                                pollution and a clear, unobstructed view of the sky. Best results
                                come from dark-sky locations away from street lights and buildings,
                                with clear skies overhead.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Tile>
    );
};
