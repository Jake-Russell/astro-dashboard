import { WeatherResponse } from "api/weather/route";
import { BaseCardProps } from "molecules/types";

export type AstroScoreCardProps = BaseCardProps & {
    weatherData: WeatherResponse;
};
