import { isAfter, isBefore, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import tzLookup from "tz-lookup";

export const timeToDate = (date: string, time: string): Date =>
    parse(`${date} ${time}`, "yyyy-MM-dd hh:mm a", new Date());

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
