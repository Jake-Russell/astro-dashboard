import { format, fromUnixTime, isAfter, isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import tzLookup from "tz-lookup";

export const getLocalTime = (epoch: number, latitude: number, longitude: number): Date => {
    const tz = tzLookup(latitude, longitude);
    const utcTime = fromUnixTime(epoch);
    return toZonedTime(utcTime, tz);
};

export const getFormattedTime = (epoch: number, latitude: number, longitude: number): string => {
    const localTime = getLocalTime(epoch, latitude, longitude);
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
    latitude: number,
    longitude: number,
    timeEpoch?: number,
): boolean => {
    const time = timeEpoch
        ? getLocalTime(timeEpoch, latitude, longitude)
        : getLocalTime(Math.floor(Date.now() / 1000), latitude, longitude);

    const rise = getLocalTime(riseEpoch, latitude, longitude);
    const set = getLocalTime(setEpoch, latitude, longitude);

    if (isBefore(set, rise)) return false;

    return isAfter(time, rise) && isBefore(time, set);
};

export const isCurrentlyPrime = (
    primeTimeStartEpoch: number = 0,
    primeTimeEndEpoch: number = 0,
    latitude: number,
    longitude: number,
): boolean => {
    if (primeTimeStartEpoch === 0 || primeTimeEndEpoch === 0) return false;

    const primeTimeStart = getLocalTime(primeTimeStartEpoch, latitude, longitude);
    const primeTimeEnd = getLocalTime(primeTimeEndEpoch, latitude, longitude);
    const now = getLocalTime(Math.floor(Date.now() / 1000), latitude, longitude);

    return !isBefore(now, primeTimeStart) && !isAfter(now, primeTimeEnd);
};
