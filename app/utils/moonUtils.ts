import { isBefore } from "date-fns";

export const getAdjustedMoonRiseAndSet = (
    moonriseEpoch?: number,
    moonsetEpoch?: number,
    tomorrowMoonsetEpoch?: number,
): { moonrise: number; moonset: number } => {
    if (!moonriseEpoch || !moonsetEpoch || !tomorrowMoonsetEpoch)
        return { moonrise: 0, moonset: 0 };

    if (isBefore(moonsetEpoch, moonriseEpoch)) {
        return { moonrise: moonriseEpoch, moonset: tomorrowMoonsetEpoch };
    }

    return { moonrise: moonriseEpoch, moonset: moonsetEpoch };
};
