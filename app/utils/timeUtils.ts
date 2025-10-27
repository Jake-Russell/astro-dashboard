import { addDays, differenceInMinutes, fromUnixTime, isAfter, isBefore, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import tzLookup from "tz-lookup";

export const formatEpochToLocal = (epoch: number, lat: string, lng: string): Date => {
    if (!epoch || !lat || !lng) return new Date();

    const tz = getTimeZone(lat, lng);
    const utcTime = fromUnixTime(epoch);
    const localTime = toZonedTime(utcTime, tz);
    return localTime;
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
    return Math.round(illumination * 100); // percentage
};

export const timeToDate = (date: string, time: string): Date =>
    parse(`${date} ${time}`, "yyyy-MM-dd hh:mm a", new Date());

export const timeStringToDate = (time: string, dayModifier: number = 0): Date =>
    parse(time, "hh:mm a", addDays(new Date(), dayModifier));

export const getTimeZone = (lat: string, lng: string): string =>
    tzLookup(parseFloat(lat), parseFloat(lng));

export const getLocalTime = (lat?: string, lng?: string): Date => {
    if (!lat || !lng) return new Date();

    const tz = getTimeZone(lat, lng);
    return toZonedTime(new Date(), tz);
};

export const isBodyUp = (
    riseEpoch: number,
    setEpoch: number,
    lat: string,
    lng: string,
): boolean => {
    if (!riseEpoch || !setEpoch || !lat || !lng) return false;

    const now = getLocalTime(lat, lng);

    const rise = formatEpochToLocal(riseEpoch, lat, lng);
    const set = formatEpochToLocal(setEpoch, lat, lng);

    // TODO: Does this need to be done?
    // const adjustedSet = isBefore(set, rise) ? addDays(set, 1) : set;

    return isAfter(now, rise) && isBefore(now, set);
};

export const getNightMoonVisibility = (
    moonriseEpoch: number,
    moonsetEpoch: number,
    sunsetEpoch: number,
    sunriseEpoch: number,
    lat: string,
    lng: string,
) => {
    const moonrise = formatEpochToLocal(moonriseEpoch, lat, lng);
    const moonset = formatEpochToLocal(moonsetEpoch, lat, lng);
    // Adjust if moonset is before moonrise (i.e., after midnight)
    const adjustedMoonset = isBefore(moonset, moonrise) ? addDays(moonset, 1) : moonset;

    const sunset = formatEpochToLocal(sunsetEpoch, lat, lng);
    const sunrise = formatEpochToLocal(sunriseEpoch, lat, lng);

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
