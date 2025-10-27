"use client";
import { isBodyUp } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";
import { useMemo } from "react";

const SunTile = () => {
    const { weatherData, weatherLoading, latitude, longitude } = useAstronomy();

    const astroData = weatherData?.forecast.forecastday[0].astro;

    const sunrise = weatherData?.forecast.forecastday[1].astro?.sunrise;
    const sunset = weatherData?.forecast.forecastday[0].astro?.sunset;

    const isSunUp = useMemo(() => {
        return isBodyUp(sunrise ?? "", sunset ?? "", latitude, longitude);
    }, [sunrise, sunset, latitude, longitude]);

    return (
        <Tile title="Sun">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && astroData && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">Sunrise: {sunrise}</div>
                        <div className="text-2xl mb-2 font-semibold">Sunset: {sunset}</div>
                        <div className="text-gray-500 text-sm mb-1">
                            {isSunUp ? "Sun is up" : "Sun is down"}
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

export default SunTile;
