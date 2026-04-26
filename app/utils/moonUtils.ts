import { isBefore } from "date-fns";

export const getAdjustedMoonRiseAndSet = (
    moonriseEpoch: number,
    moonsetEpoch: number,
    tomorrowMoonsetEpoch: number,
): { moonrise: number; moonset: number } => {
    if (isBefore(moonsetEpoch, moonriseEpoch)) {
        return { moonrise: moonriseEpoch, moonset: tomorrowMoonsetEpoch };
    }

    return { moonrise: moonriseEpoch, moonset: moonsetEpoch };
};

export const getMoonPhase = (value: number): string => {
    if (value === 0 || value === 1) return "New Moon";
    if (value > 0 && value < 0.25) return "Waxing Crescent";
    if (value === 0.25) return "First Quarter";
    if (value > 0.25 && value < 0.5) return "Waxing Gibbous";
    if (value === 0.5) return "Full Moon";
    if (value > 0.5 && value < 0.75) return "Waning Gibbous";
    if (value === 0.75) return "Last Quarter";
    if (value > 0.75 && value < 1) return "Waning Crescent";
    return "Unknown";
};
