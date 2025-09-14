"use client";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

export type AstronomyData = {
    localTime: string;
    location: string;
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
    is_moon_up: boolean;
    is_sun_up: boolean;
    error: string;
};

const MoonPhaseTile = () => {
    const { astronomyData, astronomyLoading } = useAstronomy();

    return (
        <Tile title="Moon Phase">
            <div className="flex flex-col items-center">
                {astronomyLoading && <div>Loading...</div>}
                {!astronomyLoading && astronomyData && !astronomyData.error && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">
                            {astronomyData.moon_phase}
                        </div>
                        <div className="w-full flex flex-col items-center mb-2">
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${astronomyData.moon_illumination}%` }}
                                ></div>
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                                Illumination: {astronomyData.moon_illumination}%
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonrise: {astronomyData.moonrise}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            Moonset: {astronomyData.moonset}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            {astronomyData.is_moon_up ? "Moon is up" : "Moon is down"}
                        </div>
                    </>
                )}
                {!astronomyLoading && astronomyData && astronomyData.error && (
                    <div className="text-red-500 text-sm">{astronomyData.error}</div>
                )}
            </div>
        </Tile>
    );
};

export default MoonPhaseTile;
