import { HourData } from "api/weather/route";
import type { BaseCardProps } from "molecules";

export type NightWeatherForecastCardProps = BaseCardProps & {
    hourlyForecast: HourData[];
    sunsetToday: number;
    sunriseTomorrow: number;
};
