"use client";
import { format, isAfter, isBefore, parse } from "date-fns";
import { HourData } from "../api/weather/route";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";
import { timeToDate } from "../utils/timeUtils";

const WeatherTile = () => {
    const { weatherData, weatherLoading } = useAstronomy();

    const today = weatherData?.forecast?.forecastday[0];
    const tomorrow = weatherData?.forecast?.forecastday[1];

    const sunsetTime = timeToDate(today?.date ?? "", today?.astro.sunset ?? "");
    const sunriseTime = timeToDate(tomorrow?.date ?? "", tomorrow?.astro.sunrise ?? "");

    const allHours = [...(today?.hour ?? []), ...(tomorrow?.hour ?? [])];

    const nightHours: HourData[] = allHours.filter((hour) => {
        const hourTime = parse(hour.time, "yyyy-MM-dd HH:mm", new Date());
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
                        {/* Data Rows */}
                        {nightHours.map((hour) => (
                            <div
                                key={hour.time_epoch}
                                className="grid grid-cols-3 gap-2 items-center text-lg mb-1"
                            >
                                <span>{format(hour.time, "HH:mm")}</span>
                                <span>{hour.condition.text}</span>
                                <span>{hour.cloud}</span>
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
