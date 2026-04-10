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
