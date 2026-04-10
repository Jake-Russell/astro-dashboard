"use client";
import { FunctionComponent } from "react";
import { isAfter, isBefore } from "date-fns";
import { HourData } from "api/weather/route";
import { Tile } from "atoms/Tile";
import { getFormattedTime, getLocalTime } from "utils/timeUtils";
import { NightWeatherForecastCardProps } from "./types";

export const NightWeatherForecastCard: FunctionComponent<NightWeatherForecastCardProps> = ({
    latitude,
    longitude,
    hourlyForecast,
    sunsetToday,
    sunriseTomorrow,
    error,
}) => {
    const sunsetTime = getLocalTime(sunsetToday, latitude, longitude);
    const sunriseTime = getLocalTime(sunriseTomorrow, latitude, longitude);

    const nightHours: HourData[] = hourlyForecast.filter((hour) => {
        const hourTime = getLocalTime(hour.dt, latitude, longitude);
        return isAfter(hourTime, sunsetTime) && isBefore(hourTime, sunriseTime);
    });

    return (
        <Tile title="Weather">
            <div className="flex flex-col items-center w-full">
                {!error ? (
                    <div className="w-full">
                        <div className="grid grid-cols-3 gap-2 text-gray-500 text-sm font-semibold border-b pb-1 mb-2">
                            <span>Time</span>
                            <span>Condition</span>
                            <span>Cloud (%)</span>
                        </div>

                        {nightHours.map((hour) => (
                            <div
                                key={hour.dt}
                                className="grid grid-cols-3 gap-2 items-center text-lg mb-1"
                            >
                                <span>{getFormattedTime(hour.dt, latitude, longitude)}</span>
                                <span>{hour.weather[0].main}</span>
                                <span>{hour.clouds}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
            </div>
        </Tile>
    );
};
