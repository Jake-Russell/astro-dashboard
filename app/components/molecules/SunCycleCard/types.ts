import type { GeoPosition } from "services/geolocationService";

export type SunCycleCardProps = GeoPosition & {
    sunrise: number;
    sunset: number;
    tomorrowSunrise: number;
};
