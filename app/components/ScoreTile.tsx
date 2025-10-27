"use client";
import React from "react";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";
import { getNightMoonVisibility } from "../utils/timeUtils";

const ScoreTile = () => {
    const { weatherData, weatherLoading } = useAstronomy();

    const astroData = weatherData?.forecast.forecastday[0].astro;

    // Moon Score
    const moonrise = astroData?.moonrise;
    const moonset = astroData?.moonset;
    const moonIllumination = astroData?.moon_illumination;
    const sunset = weatherData?.forecast.forecastday[0].astro?.sunset;
    const sunrise = weatherData?.forecast.forecastday[1].astro?.sunrise;

    // const moonIlluminationText = "...";
    // TODO... Add scoring logic here

    const { nightDuration, moonDownDuringNight } = getNightMoonVisibility(
        moonrise ?? "",
        moonset ?? "",
        sunset ?? "",
        sunrise ?? "",
    );

    return (
        <Tile title="Score">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && astroData && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">Moon Score</div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moon is down from {moonset} to {sunrise} (
                            {((moonDownDuringNight / nightDuration) * 100).toFixed(2)}% of the night
                            )
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moon is {moonIllumination}% illuminated whilst it is visible.
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
