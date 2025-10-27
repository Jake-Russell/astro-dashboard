import { addDays, differenceInMinutes, isAfter, isBefore, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import tzLookup from "tz-lookup";

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

export const isBodyUp = (rise: string, set: string, lat: string, lng: string): boolean => {
    const now = getLocalTime(lat, lng);
    const riseTime = parse(rise, "hh:mm a", now);
    const setTime = parse(set, "hh:mm a", now);

    return isAfter(now, riseTime) && isBefore(now, setTime);
};

export const getNightMoonVisibility = (
    moonriseStr: string,
    moonsetStr: string,
    sunsetStr: string,
    sunriseStr: string,
) => {
    const now = new Date();

    const moonrise = parse(moonriseStr, "hh:mm a", now);
    const moonset = parse(moonsetStr, "hh:mm a", now);
    // Adjust if moonset is before moonrise (i.e., after midnight)
    const adjustedMoonset = isBefore(moonset, moonrise) ? addDays(moonset, 1) : moonset;

    const sunset = parse(sunsetStr, "hh:mm a", now);
    const sunrise = parse(sunriseStr, "hh:mm a", addDays(now, 1)); // next day

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
