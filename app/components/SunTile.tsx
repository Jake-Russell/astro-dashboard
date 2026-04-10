"use client";
import { useMemo } from "react";
import { getFormattedTime, isBodyUp } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import { Tile } from "./Tile/Tile";

export const SunTile = () => {
    const { latitude, longitude, weatherData } = useAstronomy();

    const { sunrise, sunset } = weatherData?.daily[0] || {};

    const isSunUp = useMemo(() => {
        return isBodyUp(sunrise, sunset, latitude, longitude);
    }, [sunrise, sunset, latitude, longitude]);

    if (!weatherData) return null;

    return (
        <Tile title="Sun">
            <div className="flex flex-col items-center">
                {!weatherData.error ? (
                    <>
                        <div className="text-2xl mb-2 font-semibold">
                            Sunrise: {getFormattedTime(sunrise, latitude, longitude)}
                        </div>
                        <div className="text-2xl mb-2 font-semibold">
                            Sunset: {getFormattedTime(sunset, latitude, longitude)}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            {isSunUp ? "Sun is up" : "Sun is down"}
                        </div>
                    </>
                ) : (
                    <div className="text-red-500 text-sm">{weatherData.error}</div>
                )}
            </div>
        </Tile>
    );
};
