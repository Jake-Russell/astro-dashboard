"use client";
import { useMemo } from "react";
import { getAdjustedMoonRiseAndSet } from "../utils/moonUtils";
import { getFormattedTime, getMoonIllumination, getMoonPhase, isBodyUp } from "../utils/timeUtils";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const MoonPhaseTile = () => {
    const { latitude, longitude, weatherLoading, weatherData } = useAstronomy();

    const moonPhase = weatherData?.daily[0]?.moon_phase;

    const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
        weatherData?.daily[0]?.moonrise,
        weatherData?.daily[0]?.moonset,
        weatherData?.daily[1]?.moonset,
    );

    const isMoonUp = useMemo(() => {
        return isBodyUp(moonrise, moonset, latitude, longitude);
    }, [moonrise, moonset, latitude, longitude]);

    return (
        <Tile title="Moon Phase">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && (
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
                )}
                {!weatherLoading && weatherData?.error && (
                    <div className="text-red-500 text-sm">{weatherData.error}</div>
                )}
            </div>
        </Tile>
    );
};

export default MoonPhaseTile;
