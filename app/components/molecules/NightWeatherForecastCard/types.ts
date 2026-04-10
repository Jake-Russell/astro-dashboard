import { HourData } from "api/weather/route";
import { BaseCardProps } from "molecules/types";

export type NightWeatherForecastCardProps = BaseCardProps & {
    hourlyForecast: HourData[];
    sunsetToday: number;
    sunriseTomorrow: number;
};
