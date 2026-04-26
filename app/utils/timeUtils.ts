import { format, fromUnixTime, isAfter, isBefore } from "date-fns";
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
    const time = timeEpoch
        ? getLocalTime(timeEpoch, lat, lng)
        : getLocalTime(Math.floor(Date.now() / 1000), lat, lng);

    const rise = getLocalTime(riseEpoch, lat, lng);
    const set = getLocalTime(setEpoch, lat, lng);

    if (isBefore(set, rise)) return false;

    return isAfter(time, rise) && isBefore(time, set);
};

export const isCurrentlyPrime = (
    primeTimeStartEpoch: number = 0,
    primeTimeEndEpoch: number = 0,
    lat: number,
    lng: number,
): boolean => {
    if (primeTimeStartEpoch === 0 || primeTimeEndEpoch === 0) return false;

    const primeTimeStart = getLocalTime(primeTimeStartEpoch, lat, lng);
    const primeTimeEnd = getLocalTime(primeTimeEndEpoch, lat, lng);
    const now = getLocalTime(Math.floor(Date.now() / 1000), lat, lng);

    return !isBefore(now, primeTimeStart) && !isAfter(now, primeTimeEnd);
};
