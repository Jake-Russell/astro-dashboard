import type { HourData } from "api/weather/types";
import type { BaseCardProps } from "molecules";

export type NightWeatherForecastCardProps = BaseCardProps & {
    hourlyForecast: HourData[];
    sunsetToday: number;
    sunriseTomorrow: number;
};
