"use client";
import { useMemo } from "react";
import { getFormattedTime, getMoonIllumination, getMoonPhase, isBodyUp } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const MoonPhaseTile = () => {
    const { latitude, longitude, weatherLoading, weatherData } = useAstronomy();

    const dayWeather = weatherData?.daily[0];

    const isMoonUp = useMemo(() => {
        return isBodyUp(dayWeather?.moonrise, dayWeather?.moonset, latitude, longitude);
    }, [dayWeather?.moonrise, dayWeather?.moonset, latitude, longitude]);

    return (
        <Tile title="Moon Phase">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && dayWeather && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">
                            {getMoonPhase(dayWeather.moon_phase)}
                        </div>
                        <div className="w-full flex flex-col items-center mb-2">
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{
                                        width: `${getMoonIllumination(dayWeather.moon_phase)}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                                Illumination: {getMoonIllumination(dayWeather.moon_phase)}%
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonrise: {getFormattedTime(dayWeather.moonrise, latitude, longitude)}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonset: {getFormattedTime(dayWeather.moonset, latitude, longitude)}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            {isMoonUp ? "Moon is up" : "Moon is down"}
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

export default MoonPhaseTile;
