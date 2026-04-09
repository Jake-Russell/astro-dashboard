"use client";
import { useMemo } from "react";
import { getAdjustedMoonRiseAndSet } from "../utils/moonUtils";
import { getFormattedTime, getMoonIllumination, getMoonPhase, isBodyUp } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

export const MoonPhaseTile = () => {
    const { latitude, longitude, weatherData } = useAstronomy();

    const todayData = weatherData?.daily[0];
    const tomorrowData = weatherData?.daily[1];

    const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
        todayData?.moonrise,
        todayData?.moonset,
        tomorrowData?.moonset,
    );

    const moonPhase = todayData?.moon_phase;

    const isMoonUp = useMemo(() => {
        return isBodyUp(moonrise, moonset, latitude, longitude);
    }, [moonrise, moonset, latitude, longitude]);

    if (!weatherData) return null;

    return (
        <Tile title="Moon Phase">
            <div className="flex flex-col items-center">
                {!weatherData.error ? (
                    <>
                        <div className="text-2xl mb-2 font-semibold">{getMoonPhase(moonPhase)}</div>
                        <div className="w-full flex flex-col items-center mb-2">
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{
                                        width: `${getMoonIllumination(moonPhase)}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                                Illumination: {getMoonIllumination(moonPhase)}%
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonrise: {getFormattedTime(moonrise, latitude, longitude)}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonset: {getFormattedTime(moonset, latitude, longitude)}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            {isMoonUp ? "Moon is up" : "Moon is down"}
                        </div>
                    </>
                ) : (
                    <div className="text-red-500 text-sm">{weatherData.error}</div>
                )}
            </div>
        </Tile>
    );
};
