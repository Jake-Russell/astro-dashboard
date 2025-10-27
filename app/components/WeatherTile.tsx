"use client";
import { format, isAfter, isBefore } from "date-fns";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";
import { formatEpochToLocal } from "../utils/timeUtils";
import { HourData } from "../api/weather/route";

const WeatherTile = () => {
    const { latitude, longitude, weatherData, weatherLoading } = useAstronomy();

    const hourlyData = weatherData?.hourly;

    const today = weatherData?.daily[0];
    const tomorrow = weatherData?.daily[1];

    const sunsetTime = formatEpochToLocal(today?.sunset ?? 0, latitude, longitude);
    const sunriseTime = formatEpochToLocal(tomorrow?.sunrise ?? 0, latitude, longitude);

    if (!hourlyData) return null;

    const nightHours: HourData[] = hourlyData.filter((hour) => {
        const hourTime = formatEpochToLocal(hour.dt, latitude, longitude);
        return isAfter(hourTime, sunsetTime) && isBefore(hourTime, sunriseTime);
    });

    return (
        <Tile title="Weather">
            <div className="flex flex-col items-center w-full">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && weatherData && !weatherData.error && (
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
                                <span>
                                    {format(
                                        formatEpochToLocal(hour.dt, latitude, longitude),
                                        "HH:mm",
                                    )}
                                </span>
                                <span>{hour.weather[0].main}</span>
                                <span>{hour.clouds}</span>
                            </div>
                        ))}
                    </div>
                )}
                {!weatherLoading && weatherData && weatherData.error && (
                    <div className="text-red-500 text-sm">{weatherData.error}</div>
                )}
            </div>
        </Tile>
    );
};

export default WeatherTile;
