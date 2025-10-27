"use client";
import { format } from "date-fns";
import { formatEpochToLocal, isBodyUp } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";
import { useMemo } from "react";

const SunTile = () => {
    const { latitude, longitude, weatherData, weatherLoading } = useAstronomy();

    const dayWeather = weatherData?.daily[0];

    const isSunUp = useMemo(() => {
        return isBodyUp(dayWeather?.sunrise ?? 0, dayWeather?.sunset ?? 0, latitude, longitude);
    }, [dayWeather?.sunrise, dayWeather?.sunset, latitude, longitude]);

    return (
        <Tile title="Sun">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}

                {!weatherLoading && !weatherData?.error && dayWeather && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">
                            Sunrise:{" "}
                            {format(
                                formatEpochToLocal(dayWeather.sunrise, latitude, longitude),
                                "HH:mm",
                            )}
                        </div>
                        <div className="text-2xl mb-2 font-semibold">
                            Sunset:{" "}
                            {format(
                                formatEpochToLocal(dayWeather.sunset, latitude, longitude),
                                "HH:mm",
                            )}
                        </div>
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
