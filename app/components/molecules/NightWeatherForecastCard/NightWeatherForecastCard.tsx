"use client";
import type { FunctionComponent } from "react";
import { Tile } from "atoms";
import { getFormattedDateTime, getFormattedTime } from "utils/timeUtils";
import type { NightWeatherForecastCardProps } from "./types";

export const NightWeatherForecastCard: FunctionComponent<NightWeatherForecastCardProps> = ({
    latitude,
    longitude,
    nightHours,
}) => {
    return (
        <Tile title="Weather" testId="weather-forecast-tile">
            <div className="w-full">
                {nightHours.length > 0 && (
                    <div className="text-xs text-(--text-secondary) mb-4">
                        <p>
                            Current local time:{" "}
                            {getFormattedDateTime(new Date().getDate(), latitude, longitude)}
                        </p>
                        <p>
                            Showing weather forecast from{" "}
                            {getFormattedDateTime(nightHours[0].dt, latitude, longitude)} to{" "}
                            {getFormattedDateTime(
                                nightHours[nightHours.length - 1].dt,
                                latitude,
                                longitude,
                            )}
                        </p>
                    </div>
                )}
                <div className="w-full space-y-2">
                    <div className="grid grid-cols-3 gap-3 text-xs font-bold text-(--text-secondary) uppercase tracking-widest border-b border-(--card-border) pb-3 mb-3">
                        <span>Time</span>
                        <span>Condition</span>
                        <span className="text-right">Cloud %</span>
                    </div>

                    <div
                        className="space-y-2 max-h-96 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) rounded-lg"
                        tabIndex={0}
                        role="region"
                        aria-label="Nightly weather forecast"
                    >
                        {nightHours.map((hour) => (
                            <div
                                key={hour.dt}
                                className="grid grid-cols-3 gap-3 items-center p-3 rounded-lg hover:bg-(--accent-primary)/5 transition-colors duration-200"
                            >
                                <span className="text-sm font-medium text-foreground">
                                    {getFormattedTime(hour.dt, latitude, longitude)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                                        alt={`${hour.weather[0].main} Icon`}
                                        className="w-6 h-6"
                                    />
                                    <span className="text-sm text-(--text-secondary)">
                                        {hour.weather[0].main}
                                    </span>
                                </div>
                                <span className="text-right">
                                    <span className="inline-block px-2 py-1 rounded-lg bg-(--accent-primary)/10 text-xs font-semibold text-(--accent-primary)">
                                        {hour.clouds}%
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Tile>
    );
};
