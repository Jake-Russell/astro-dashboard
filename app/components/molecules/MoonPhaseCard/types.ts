import { BaseCardProps } from "molecules/types";

export type MoonPhaseCardProps = BaseCardProps & {
    moonriseToday: number;
    moonsetToday: number;
    moonsetTomorrow: number;
    moonPhase: number;
};
