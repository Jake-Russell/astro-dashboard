"use client";
import { FunctionComponent, useMemo } from "react";
import { Tile } from "atoms/Tile";
import { getFormattedTime, isBodyUp } from "utils/timeUtils";
import { SunCycleCardProps } from "./types";

export const SunCycleCard: FunctionComponent<SunCycleCardProps> = ({
    latitude,
    longitude,
    sunrise,
    sunset,
    error,
}) => {
    const isSunUp = useMemo(() => {
        return isBodyUp(sunrise, sunset, latitude, longitude);
    }, [sunrise, sunset, latitude, longitude]);

    return (
        <Tile title="Sun">
            <div className="flex flex-col items-center">
                {!error ? (
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
                    <div className="text-red-500 text-sm">{error}</div>
                )}
            </div>
        </Tile>
    );
};
