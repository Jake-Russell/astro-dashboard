"use client";
import React from "react";
import { getFormattedTime, getMoonIllumination, getNightMoonVisibility } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const ScoreTile = () => {
    const { latitude, longitude, weatherData, weatherLoading } = useAstronomy();

    // const moonIlluminationText = "...";
    // TODO... Add scoring logic here

    const today = weatherData?.daily[0];
    const tomorrow = weatherData?.daily[1];

    const { nightDuration, moonDownDuringNight } = getNightMoonVisibility(
        today?.moonrise,
        today?.moonset,
        today?.sunset,
        tomorrow?.sunrise,
        latitude,
        longitude,
    );

    return (
        <Tile title="Score">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && weatherData && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">Moon Score</div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moon is down from{" "}
                            {getFormattedTime(weatherData.daily[0].moonset, latitude, longitude)} to{" "}
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
