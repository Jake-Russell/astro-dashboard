"use client";

import type { FunctionComponent } from "react";
import { Tile } from "atoms";
import { getFormattedDateTime, getFormattedTime } from "utils/timeUtils";
import { getMoonAltitude } from "utils/weatherUtils";
import type { NightWeatherForecastCardProps } from "./types";

export const NightWeatherForecastCard: FunctionComponent<NightWeatherForecastCardProps> = ({
    latitude,
    longitude,
    nightHours,
}) => {
    return (
        <Tile title="Weather" testId="weather-forecast-tile">
            <div className="w-full">
                {nightHours.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                        <div className="text-4xl mb-4" aria-hidden="true">
                            🌙
                        </div>
                        <h3 className="text-base font-semibold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent">
                            No forecast available for tonight
                        </h3>
                        <p className="mt-2 max-w-md mx-auto text-sm leading-relaxed text-(--text-secondary)">
                            There isn&apos;t enough weather forecast data available for the upcoming
                            night period.
                        </p>
                    </div>
                ) : (
                    <>
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
                                            className="text-center border-b border-(--card-border) pb-3"
                                        >
                                            Moon Alt.
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
                                    {nightHours.map(({ dt, weather, clouds }) => {
                                        const moonAlt = getMoonAltitude(dt, latitude, longitude);

                                        return (
                                            <tr
                                                key={dt}
                                                className="hover:bg-(--accent-primary)/5 transition-colors duration-200"
                                            >
                                                <td className="py-3 text-left text-sm font-medium text-foreground">
                                                    {getFormattedTime(dt, latitude, longitude)}
                                                </td>

                                                <td className="py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <img
                                                            src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                                                            alt=""
                                                            className="w-6 h-6"
                                                        />
                                                        <span className="hidden sm:inline-block text-sm text-(--text-secondary)">
                                                            {weather[0].main}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span
                                                            aria-hidden="true"
                                                            className="hidden sm:inline-block text-lg"
                                                            style={{
                                                                transform: `rotate(${moonAlt * -1}deg)`,
                                                            }}
                                                        >
                                                            →
                                                        </span>

                                                        <span className="text-sm text-(--text-secondary)">
                                                            <span className="sr-only">
                                                                Moon bearing{" "}
                                                            </span>
                                                            {moonAlt.toFixed(2)}°
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3 text-right">
                                                    <span className="inline-block px-2 py-1 rounded-lg bg-(--accent-primary)/10 text-xs font-semibold text-(--accent-primary)">
                                                        {clouds}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </Tile>
    );
};
