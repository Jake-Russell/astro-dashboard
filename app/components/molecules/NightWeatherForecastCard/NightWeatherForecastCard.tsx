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
                            {getFormattedDateTime(
                                Math.floor(Date.now() / 1000),
                                latitude,
                                longitude,
                            )}
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
                <div
                    tabIndex={0}
                    role="region"
                    aria-label="Scrollable nightly weather forecast table"
                    className="max-h-96 overflow-y-auto outline-none rounded-lg"
                >
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest">
                                <th
                                    scope="col"
                                    className="text-left border-b border-(--card-border) pb-3"
                                >
                                    Time
                                </th>
                                <th
                                    scope="col"
                                    className="text-center border-b border-(--card-border) pb-3"
                                >
                                    Condition
                                </th>
                                <th
                                    scope="col"
                                    className="text-right border-b border-(--card-border) pb-3"
                                >
                                    Cloud %
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {nightHours.map((hour) => (
                                <tr
                                    key={hour.dt}
                                    className="hover:bg-(--accent-primary)/5 transition-colors duration-200"
                                >
                                    <td className="py-3 text-left text-sm font-medium text-foreground">
                                        {getFormattedTime(hour.dt, latitude, longitude)}
                                    </td>

                                    <td className="py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <img
                                                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                                                alt=""
                                                className="w-6 h-6"
                                            />
                                            <span className="text-sm text-(--text-secondary)">
                                                {hour.weather[0].main}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3 text-right">
                                        <span className="inline-block px-2 py-1 rounded-lg bg-(--accent-primary)/10 text-xs font-semibold text-(--accent-primary)">
                                            {hour.clouds}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Tile>
    );
};
