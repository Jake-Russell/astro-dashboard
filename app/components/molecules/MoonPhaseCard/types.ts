import type { BaseCardProps } from "molecules";

export type MoonPhaseCardProps = BaseCardProps & {
    moonriseToday: number;
    moonsetToday: number;
    moonsetTomorrow: number;
    moonPhase: number;
};
