"use client";
import { FunctionComponent } from "react";
import { Tile } from "atoms/Tile";
import {
    getFormattedTime,
    getLocalTime,
    getMoonIllumination,
    getNightMoonVisibility,
    isCurrentlyPrime,
} from "utils/timeUtils";
import { AstroScoreCardProps } from "./types";
import { isAfter, isBefore } from "date-fns";
import { getAstroScore } from "utils/weatherUtils";
import { getAdjustedMoonRiseAndSet } from "utils/moonUtils";

export const AstroScoreCard: FunctionComponent<AstroScoreCardProps> = ({
    latitude,
    longitude,
    weatherData,
    error,
}) => {
    const today = weatherData.daily[0];
    const tomorrow = weatherData.daily[1];

    // TODO: Review unused vars and clean up
    /* eslint-disable @typescript-eslint/no-unused-vars */

    const { nightDuration, moonUpDuringNight, moonDownDuringNight } = getNightMoonVisibility(
        today.moonrise,
        today.moonset,
        today.sunset,
        tomorrow.sunrise,
        latitude,
        longitude,
    );

    const sunsetTime = getLocalTime(today.sunset, latitude, longitude);
    const sunriseTime = getLocalTime(tomorrow.sunrise, latitude, longitude);

    // Get all hourly data for tonight
    const nightHours = weatherData.hourly.filter((hour) => {
        const hourTime = getLocalTime(hour.dt, latitude, longitude);
        return isAfter(hourTime, sunsetTime) && isBefore(hourTime, sunriseTime);
    });

    if (nightHours.length === 0) return;

    const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
        today.moonrise,
        today.moonset,
        tomorrow.moonset,
    );

    const {
        currentScore,
        currentBreakdown,
        summary,
        hourlyScores,
        primeTimeStart,
        primeTimeEnd,
        primeScore,
    } = getAstroScore(
        nightHours,
        getMoonIllumination(today.moon_phase),
        moonrise,
        moonset,
        today.sunset,
        tomorrow.sunrise,
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

    return (
        <Tile title="Score">
            <div className="w-full">
                {!error ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h3 className="text-3xl font-bold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent">
                                🌙 Astro Score
                            </h3>
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
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-(--text-secondary) text-center">{summary}</p>

                        <div className="p-4 rounded-lg bg-(--card-background) border border-(--card-border)">
                            <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-3">
                                Score Breakdown
                            </p>

                            <div className="space-y-4 text-sm">
                                {/* CLOUDS */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span>☁️ Clouds</span>
                                        <span>{currentBreakdown.cloud.toFixed(1)} / 5</span>
                                    </div>

                                    <div className="h-2 w-full bg-(--card-border) rounded">
                                        <div
                                            className="h-2 bg-(--accent-primary) rounded transition-all"
                                            style={{
                                                width: `${(currentBreakdown.cloud / 5) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* MOON BRIGHTNESS */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span>🌕 Moon Brightness</span>
                                        <span>
                                            {currentBreakdown.moonIllumination.toFixed(1)} / 3
                                        </span>
                                    </div>

                                    <div className="h-2 w-full bg-(--card-border) rounded">
                                        <div
                                            className="h-2 bg-(--accent-secondary) rounded transition-all"
                                            style={{
                                                width: `${
                                                    (currentBreakdown.moonIllumination / 3) * 100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* MOON VISIBILITY */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span>🌙 Moon Visibility</span>
                                        <span>
                                            {currentBreakdown.moonVisibility.toFixed(1)} / 2
                                        </span>
                                    </div>

                                    <div className="h-2 w-full bg-(--card-border) rounded">
                                        <div
                                            className="h-2 bg-(--accent-tertiary) rounded transition-all"
                                            style={{
                                                width: `${
                                                    (currentBreakdown.moonVisibility / 2) * 100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prime Time */}
                        {primeStartTime && primeEndTime && primeScore && (
                            <div
                                className={`p-4 rounded-lg border ${
                                    isInPrimeWindow
                                        ? "bg-green-500/10 border-green-500/30"
                                        : "bg-(--accent-secondary)/10 border border-(--accent-secondary)/30"
                                }`}
                            >
                                <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    🌟 Prime Conditions
                                </p>
                                {isInPrimeWindow && (
                                    <p className="text-sm font-bold text-green-600 mb-2">
                                        ✨ Currently prime conditions!
                                    </p>
                                )}
                                <p className="text-sm text-(--text-primary) font-medium">
                                    Between {primeStartTime} and {primeEndTime}
                                </p>
                                <p className="text-xs text-(--text-secondary) mt-1">
                                    Expected score: {primeScore} / 10
                                </p>
                            </div>
                        )}

                        {/* Supporting Metrics */}
                        <div className="space-y-3 border-t border-(--card-border) pt-4">
                            {/* Clouds */}
                            <div className="p-4 rounded-lg bg-(--accent-primary)/5 border border-(--accent-primary)/20 hover:border-(--accent-primary)/40 transition-colors">
                                <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    Cloud Coverage
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-(--accent-primary)">
                                        {nightHours.length > 0
                                            ? (
                                                  nightHours.reduce((sum, h) => sum + h.clouds, 0) /
                                                  nightHours.length
                                              ).toFixed(0)
                                            : "N/A"}
                                        %
                                    </span>
                                    <span className="text-sm text-(--text-secondary)">
                                        average tonight
                                    </span>
                                </div>
                            </div>

                            {/* Moon Illumination */}
                            <div className="p-4 rounded-lg bg-(--accent-secondary)/5 border border-(--accent-secondary)/20 hover:border-(--accent-secondary)/40 transition-colors">
                                <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    Moon Illumination
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-(--accent-secondary)">
                                        {getMoonIllumination(today.moon_phase)}%
                                    </span>
                                    <span className="text-sm text-(--text-secondary)">
                                        {getMoonIllumination(today.moon_phase) < 50
                                            ? "🌑 Dark"
                                            : "🌕 Bright"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 rounded-lg bg-(--accent-tertiary)/10 border border-(--accent-tertiary)/20">
                        <p className="text-sm text-(--accent-tertiary) font-medium">
                            ⚠️ {weatherData.error}
                        </p>
                    </div>
                )}
            </div>
        </Tile>
    );
};
