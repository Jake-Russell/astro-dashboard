"use client";
import React from "react";
import { isAfter, isBefore } from "date-fns";
import { HourData } from "../api/weather/route";
import { getAdjustedMoonRiseAndSet } from "../utils/moonUtils";
import {
    getFormattedTime,
    getLocalTime,
    getMoonIllumination,
    getNightMoonVisibility,
} from "../utils/timeUtils";
import { getAstroScore } from "../utils/weatherUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const ScoreTile = () => {
    const { latitude, longitude, weatherData, weatherLoading } = useAstronomy();

    // const moonIlluminationText = "...";
    // TODO... Add scoring logic here

    const hourlyData = weatherData?.hourly;
    const today = weatherData?.daily[0];
    const tomorrow = weatherData?.daily[1];

    const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
        weatherData?.daily[0]?.moonrise,
        weatherData?.daily[0]?.moonset,
        weatherData?.daily[1]?.moonset,
    );

    const { nightDuration, moonUpDuringNight, moonDownDuringNight } = getNightMoonVisibility(
        moonrise,
        moonset,
        today?.sunset,
        tomorrow?.sunrise,
        latitude,
        longitude,
    );

    const sunsetTime = getLocalTime(today?.sunset, latitude, longitude);
    const sunriseTime = getLocalTime(tomorrow?.sunrise, latitude, longitude);

    if (!hourlyData) return null;

    const nightHours: HourData[] = hourlyData.filter((hour) => {
        const hourTime = getLocalTime(hour.dt, latitude, longitude);
        return isAfter(hourTime, sunsetTime) && isBefore(hourTime, sunriseTime);
    });

    const score = getAstroScore(
        nightHours.map((nh) => nh.clouds),
        moonUpDuringNight,
        10,
        nightDuration,
    );

    // eslint-disable-next-line no-console
    console.log("Astro Score:", score);

    return (
        <Tile title="Score">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && weatherData && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">Moon Score</div>
                        <div className="text-gray-500 text-sm mb-1">
                            {/* TODO: Sort this out */}
                            Moon is down from {getFormattedTime(
                                moonset,
                                latitude,
                                longitude,
                            )} to{" "}
                            {getFormattedTime(weatherData.daily[1].sunrise, latitude, longitude)} (
                            {((moonDownDuringNight / nightDuration) * 100).toFixed(2)}% of the night
                            )
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moon is {getMoonIllumination(weatherData.daily[0].moon_phase)}%
                            illuminated whilst it is visible.
                        </div>
                    </>
                )}
                {!weatherLoading && weatherData?.error && (
                    <div className="text-red-500 text-sm">{weatherData.error}</div>
                )}
            </div>
        </Tile>
    );
};

export default ScoreTile;
