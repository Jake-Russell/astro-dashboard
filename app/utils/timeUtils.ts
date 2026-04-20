import { addDays, differenceInMinutes, format, fromUnixTime, isAfter, isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import tzLookup from "tz-lookup";

export const getLocalTime = (epoch: number, lat: number, lng: number): Date => {
    const tz = tzLookup(lat, lng);
    const utcTime = fromUnixTime(epoch);
    return toZonedTime(utcTime, tz);
};

export const getFormattedTime = (epoch: number, lat: number, lng: number): string => {
    const localTime = getLocalTime(epoch, lat, lng);
    return format(localTime, "HH:mm");
};

export const getMoonPhase = (value?: number): string => {
    if (!value) return "Unknown";

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

export const getMoonIllumination = (value?: number): number => {
    if (value === undefined) return 0;

    const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * value));
    return Math.round(illumination * 100); // percentage
};

export const isBodyUp = (
    riseEpoch: number,
    /**
     * The epoch time of the body's set.
     * Make sure this is the adjusted set time retrieved from getAdjustedBodyRiseAndSet
     * I.e., if the body sets before it rises, use tomorrow's set time.
     */
    setEpoch: number,
    lat: number,
    lng: number,
    timeEpoch?: number,
): boolean => {
    if (!riseEpoch || !setEpoch || !lat || !lng) return false;

    const time = timeEpoch
        ? getLocalTime(timeEpoch, lat, lng)
        : getLocalTime(Math.floor(Date.now() / 1000), lat, lng);

    const rise = getLocalTime(riseEpoch, lat, lng);
    const set = getLocalTime(setEpoch, lat, lng);

    if (isBefore(set, rise)) {
        return false;
    }

    return isAfter(time, rise) && isBefore(time, set);
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
