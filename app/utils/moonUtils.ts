import { addDays, differenceInMinutes, isAfter, isBefore } from "date-fns";
import { getLocalTime } from "./timeUtils";

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

export const getMoonIllumination = (value: number): number => {
    const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * value));
    return Math.round(illumination * 100);
};

export const getNightMoonVisibility = (
    moonriseEpoch: number,
    moonsetEpoch: number,
    sunsetEpoch: number,
    sunriseEpoch: number,
    lat: number,
    lng: number,
) => {
    const moonrise = getLocalTime(moonriseEpoch, lat, lng);
    const moonset = getLocalTime(moonsetEpoch, lat, lng);
    // Adjust if moonset is before moonrise (i.e., after midnight)
    const adjustedMoonset = isBefore(moonset, moonrise) ? addDays(moonset, 1) : moonset;

    const sunset = getLocalTime(sunsetEpoch, lat, lng);
    const sunrise = getLocalTime(sunriseEpoch, lat, lng);

    const nightStart = sunset;
    const nightEnd = sunrise;

    let moonUpDuringNight = 0;

    // Case 1: Moon sets before night starts → 0
    if (isBefore(adjustedMoonset, nightStart)) moonUpDuringNight = 0;
    // Case 2: Moon rises after night ends → 0
    else if (isAfter(moonrise, nightEnd)) moonUpDuringNight = 0;
    else {
        // Compute overlap interval
        const overlapStart = isAfter(moonrise, nightStart) ? moonrise : nightStart;
        const overlapEnd = isBefore(adjustedMoonset, nightEnd) ? adjustedMoonset : nightEnd;

        moonUpDuringNight = Math.max(0, differenceInMinutes(overlapEnd, overlapStart));
    }

    const nightDuration = differenceInMinutes(nightEnd, nightStart);
    const moonDownDuringNight = nightDuration - moonUpDuringNight;

    return {
        nightDuration,
        moonUpDuringNight,
        moonDownDuringNight,
    };
};
