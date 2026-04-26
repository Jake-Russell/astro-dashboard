import type { BaseCardProps } from "molecules";

export type SunCycleCardProps = BaseCardProps & {
    sunrise: number;
    sunset: number;
    tomorrowSunrise: number;
};
