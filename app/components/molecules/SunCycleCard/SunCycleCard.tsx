"use client";
import { FunctionComponent, useMemo } from "react";
import { Tile } from "atoms";
import { getFormattedTime, isBodyUp } from "utils/timeUtils";
import { SunCycleCardProps } from "./types";

export const SunCycleCard: FunctionComponent<SunCycleCardProps> = ({
    latitude,
    longitude,
    sunrise,
    sunset,
    tomorrowSunrise,
}) => {
    const isSunUp = useMemo(() => {
        return isBodyUp(sunrise, sunset, latitude, longitude);
    }, [sunrise, sunset, latitude, longitude]);

    return (
        <Tile title="Sun">
            <div className="w-full">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-(--accent-primary)/10 to-(--accent-secondary)/5 border border-(--accent-primary)/20 hover:border-(--accent-primary)/40 transition-colors">
                            <span className="text-sm text-(--text-secondary) font-semibold uppercase tracking-widest">
                                🌅 Sunrise
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {getFormattedTime(sunrise, latitude, longitude)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-(--accent-secondary)/10 to-(--accent-tertiary)/5 border border-(--accent-secondary)/20 hover:border-(--accent-secondary)/40 transition-colors">
                            <span className="text-sm text-(--text-secondary) font-semibold uppercase tracking-widest">
                                🌇 Sunset
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {getFormattedTime(sunset, latitude, longitude)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-(--accent-primary)/10 to-(--accent-secondary)/5 border border-(--accent-primary)/20 hover:border-(--accent-primary)/40 transition-colors">
                            <span className="text-sm text-(--text-secondary) font-semibold uppercase tracking-widest">
                                🌅 Tomorrow&apos;s Sunrise
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {getFormattedTime(tomorrowSunrise, latitude, longitude)}
                            </span>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-(--card-border)">
                        <div className="flex items-center justify-between p-3 rounded-lg">
                            <span className="text-sm text-(--text-secondary) font-medium">
                                Status
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-(--accent-primary)/10 text-(--accent-primary)">
                                {`Sun is ${isSunUp ? "up" : "down"}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Tile>
    );
};
