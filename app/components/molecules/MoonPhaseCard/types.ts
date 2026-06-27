import type { GeoPosition } from "services/geolocationService";

export type MoonPhaseCardProps = GeoPosition & {
    moonriseToday: number;
    moonsetToday: number;
    moonsetTomorrow: number;
    moonPhase: number;
};
