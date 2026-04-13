import { BaseCardProps } from "molecules/types";

export type SunCycleCardProps = BaseCardProps & {
    sunrise: number;
    sunset: number;
};
