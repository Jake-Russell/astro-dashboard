"use client";
import { FunctionComponent } from "react";
import { Tile } from "atoms/Tile";
import { getFormattedTime, getMoonIllumination, getNightMoonVisibility } from "utils/timeUtils";
import { AstroScoreCardProps } from "./types";

export const AstroScoreCard: FunctionComponent<AstroScoreCardProps> = ({
    latitude,
    longitude,
    weatherData,
    error,
}) => {
    // const moonIlluminationText = "...";
    // TODO... Add scoring logic here

    const today = weatherData.daily[0];
    const tomorrow = weatherData.daily[1];

    const { nightDuration, moonDownDuringNight } = getNightMoonVisibility(
        today.moonrise,
        today.moonset,
        today.sunset,
        tomorrow?.sunrise,
        latitude,
        longitude,
    );

    return (
        <Tile title="Score">
            <div className="w-full">
                {!error ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h3 className="text-3xl font-bold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent">
                                🌙 Moon Score
                            </h3>
                            <p className="text-sm text-(--text-secondary)">
                                Optimal viewing conditions tonight
                            </p>
                        </div>

                        <div className="space-y-3 border-t border-(--card-border) pt-4">
                            <div className="p-4 rounded-lg bg-(--accent-primary)/5 border border-(--accent-primary)/20 hover:border-(--accent-primary)/40 transition-colors">
                                <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    Moon Down Time
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-(--accent-primary)">
                                        {((moonDownDuringNight / nightDuration) * 100).toFixed(1)}%
                                    </span>
                                    <span className="text-sm text-(--text-secondary)">
                                        of the night
                                    </span>
                                </div>
                                <p className="text-xs text-(--text-secondary) mt-2">
                                    From{" "}
                                    {getFormattedTime(
                                        weatherData.daily[0].moonset,
                                        latitude,
                                        longitude,
                                    )}{" "}
                                    to{" "}
                                    {getFormattedTime(
                                        weatherData.daily[1].sunrise,
                                        latitude,
                                        longitude,
                                    )}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-(--accent-secondary)/5 border border-(--accent-secondary)/20 hover:border-(--accent-secondary)/40 transition-colors">
                                <p className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest mb-2">
                                    Moon Illumination
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-(--accent-secondary)">
                                        {getMoonIllumination(weatherData.daily[0].moon_phase)}%
                                    </span>
                                    <span className="text-sm text-(--text-secondary)">
                                        {getMoonIllumination(weatherData.daily[0].moon_phase) < 50
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
