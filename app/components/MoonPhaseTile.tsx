"use client";
import { useMemo } from "react";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";
import { isBodyUp } from "../utils/timeUtils";

const MoonPhaseTile = () => {
    const { latitude, longitude, weatherData, weatherLoading } = useAstronomy();

    const astroData = weatherData?.forecast.forecastday[0].astro;

    const isMoonUp = useMemo(() => {
        return isBodyUp(astroData?.moonrise ?? "", astroData?.moonset ?? "", latitude, longitude);
    }, [astroData?.moonrise, astroData?.moonset, latitude, longitude]);

    return (
        <Tile title="Moon Phase">
            <div className="flex flex-col items-center">
                {weatherLoading && <div>Loading...</div>}
                {!weatherLoading && !weatherData?.error && astroData && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">{astroData.moon_phase}</div>
                        <div className="w-full flex flex-col items-center mb-2">
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${astroData.moon_illumination}%` }}
                                ></div>
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                                Illumination: {astroData.moon_illumination}%
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonrise: {astroData.moonrise}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonset: {astroData.moonset}
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
