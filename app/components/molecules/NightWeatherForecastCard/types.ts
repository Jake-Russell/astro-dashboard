import type { HourData } from "api/weather/types";
import type { GeoPosition } from "services/geolocationService";

export type NightWeatherForecastCardProps = GeoPosition & {
    nightHours: HourData[];
};
