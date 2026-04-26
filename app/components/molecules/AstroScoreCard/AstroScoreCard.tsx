"use client";
import { FunctionComponent } from "react";
import { isAfter, isBefore, format } from "date-fns";
import { Tile } from "atoms";
import {
    getAdjustedMoonRiseAndSet,
    getMoonIllumination,
    getNightMoonVisibility,
} from "utils/moonUtils";
import { getFormattedTime, getLocalTime, isCurrentlyPrime } from "utils/timeUtils";
import { getAstroScore } from "utils/weatherUtils";
import { AstroScoreCardProps } from "./types";

export const AstroScoreCard: FunctionComponent<AstroScoreCardProps> = ({
    latitude,
    longitude,
    moonriseToday,
    moonsetToday,
    moonsetTomorrow,
    moonPhase,
    sunsetToday,
    sunriseTomorrow,
    hourlyForecast,
}) => {
    // TODO: Review unused vars and clean up
    /* eslint-disable @typescript-eslint/no-unused-vars */

    const { nightDuration, moonUpDuringNight, moonDownDuringNight } = getNightMoonVisibility(
        moonriseToday,
        moonsetToday,
        sunsetToday,
        sunriseTomorrow,
        latitude,
        longitude,
    );

    const sunsetTime = getLocalTime(sunsetToday, latitude, longitude);
    const sunriseTime = getLocalTime(sunriseTomorrow, latitude, longitude);

    // Get all hourly data for tonight
    const nightHours = hourlyForecast.filter((hour) => {
        const hourTime = getLocalTime(hour.dt, latitude, longitude);
        return isAfter(hourTime, sunsetTime) && isBefore(hourTime, sunriseTime);
    });

    const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
        moonriseToday,
        moonsetToday,
        moonsetTomorrow,
    );

    const moonIllumination = getMoonIllumination(moonPhase);

    const {
        currentScore,
        currentBreakdown,
        summary,
        breakdownTime,
        hourlyScores,
        primeTimeStart,
        primeTimeEnd,
        primeScore,
    } = getAstroScore(
        nightHours,
        moonIllumination,
        moonrise,
        moonset,
        sunsetToday,
        sunriseTomorrow,
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

    const currentTime = getFormattedTime(new Date().getTime() / 1000, latitude, longitude);
    const currentDate = format(new Date(), "MMM d, yyyy");

    const breakdownTimeFormatted =
        breakdownTime !== 0 ? getFormattedTime(breakdownTime, latitude, longitude) : undefined;

    return (
        <Tile title="Score">
            <div className="w-full">
                <div className="space-y-6">
                    <div className="text-xs text-(--text-secondary) mb-2">
                        {currentDate} • {currentTime}
                    </div>

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

                    {breakdownTimeFormatted && (
                        <div className="p-4 rounded-lg bg-(--card-background) border border-(--card-border)">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest">
                                    Score Breakdown
                                </p>
                                <p className="text-xs text-(--text-secondary)">
                                    {breakdownTimeFormatted}
                                </p>
                            </div>

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
                    )}

                    {!!primeStartTime && !!primeEndTime && !!primeScore && primeScore && (
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
                                <p className="text-sm font-bold text-green-700 mb-2">
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

                    <div className="space-y-3 border-t border-(--card-border) pt-4">
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

                        <div className="p-4 rounded-lg bg-(--accent-secondary)/5 border border-(--accent-secondary)/20 hover:border-(--accent-secondary)/40 transition-colors">
                            <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                Moon Illumination
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-(--accent-secondary)">
                                    {moonIllumination}%
                                </span>
                                <span className="text-sm text-(--text-secondary)">
                                    {moonIllumination < 50 ? "🌑 Dark" : "🌕 Bright"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Tile>
    );
};
