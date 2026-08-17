import type { ActiveError } from "./types";

export const getActiveError = (
    locationError?: string,
    weatherError?: string,
): ActiveError | undefined => {
    if (locationError) {
        return {
            title: "Unable to use your location",
            message: locationError,
            type: "location",
        };
    }

    if (weatherError) {
        return {
            title: "Unable to load weather data",
            message: weatherError,
            type: "weather",
        };
    }

    return undefined;
};
