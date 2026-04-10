"use client";
import { isAfter, isBefore } from "date-fns";
import { HourData } from "../api/weather/route";
import { getFormattedTime, getLocalTime } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import { Tile } from "./Tile/Tile";

export const WeatherTile = () => {
    const { latitude, longitude, weatherData } = useAstronomy();

    if (!weatherData) return null;

    const hourlyData = weatherData.hourly;

    const today = weatherData.daily[0];
    const tomorrow = weatherData.daily[1];

    const sunsetTime = getLocalTime(today.sunset, latitude, longitude);
    const sunriseTime = getLocalTime(tomorrow.sunrise, latitude, longitude);

    if (!hourlyData) return null;

    const nightHours: HourData[] = hourlyData.filter((hour) => {
        const hourTime = getLocalTime(hour.dt, latitude, longitude);
        return isAfter(hourTime, sunsetTime) && isBefore(hourTime, sunriseTime);
    });

    return (
        <Tile title="Weather">
            <div className="flex flex-col items-center w-full">
                {!weatherData.error ? (
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
                    <div className="text-red-500 text-sm">{weatherData.error}</div>
                )}
            </div>
        </Tile>
    );
};
