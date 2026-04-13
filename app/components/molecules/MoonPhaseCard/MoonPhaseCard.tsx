"use client";
import { FunctionComponent, useMemo } from "react";
import { Tile } from "atoms/Tile";
import { getAdjustedMoonRiseAndSet } from "utils/moonUtils";
import { getFormattedTime, getMoonIllumination, getMoonPhase, isBodyUp } from "utils/timeUtils";
import { MoonPhaseCardProps } from "./types";

export const MoonPhaseCard: FunctionComponent<MoonPhaseCardProps> = ({
    latitude,
    longitude,
    moonriseToday,
    moonsetToday,
    moonsetTomorrow,
    moonPhase,
    error,
}) => {
    const { moonrise, moonset } = getAdjustedMoonRiseAndSet(
        moonriseToday,
        moonsetToday,
        moonsetTomorrow,
    );

    const isMoonUp = useMemo(() => {
        return isBodyUp(moonrise, moonset, latitude, longitude);
    }, [moonrise, moonset, latitude, longitude]);

    return (
        <Tile title="Moon Phase">
            <div className="w-full">
                {!error ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-3">
                            <div className="text-4xl font-bold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent">
                                {getMoonPhase(moonPhase)}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-(--text-secondary) uppercase tracking-widest">
                                    <span>Illumination</span>
                                    <span>{getMoonIllumination(moonPhase)}%</span>
                                </div>
                                <div className="w-full h-2 bg-(--card-border) rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary)"
                                        style={{
                                            width: `${getMoonIllumination(moonPhase)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-(--card-border)">
                            <div className="flex items-center justify-between p-3 rounded-lg">
                                <span className="text-sm text-(--text-secondary) font-medium">
                                    🌙 Moonrise
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                    {getFormattedTime(moonrise, latitude, longitude)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg">
                                <span className="text-sm text-(--text-secondary) font-medium">
                                    🌕 Moonset
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                    {getFormattedTime(moonset, latitude, longitude)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg">
                                <span className="text-sm text-(--text-secondary) font-medium">
                                    Status
                                </span>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-(--accent-secondary)/10 text-(--accent-secondary)">
                                    {`Moon is ${isMoonUp ? "up" : "down"}`}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 rounded-lg bg-(--accent-tertiary)/10 border border-(--accent-tertiary)/20">
                        <p className="text-sm text-(--accent-tertiary) font-medium">⚠️ {error}</p>
                    </div>
                )}
            </div>
        </Tile>
    );
};
