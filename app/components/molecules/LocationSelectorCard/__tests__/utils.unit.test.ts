import { describe, expect, it } from "vitest";
import { getActiveError } from "../utils";

describe("getActiveError", () => {
    const locationErrorMessage =
        "We couldn't get your location in time. Please try again or search for a location instead.";
    const weatherErrorMessage = "Failed to fetch weather data";

    it("should return a location error, given a location error", () => {
        const result = getActiveError(locationErrorMessage, undefined);

        expect(result).toEqual({
            title: "Unable to use your location",
            message: locationErrorMessage,
            type: "location",
        });
    });

    it("should return a weather error, given a weather error and no location error", () => {
        const result = getActiveError(undefined, weatherErrorMessage);

        expect(result).toEqual({
            title: "Unable to load weather data",
            message: weatherErrorMessage,
            type: "weather",
        });
    });

    it("should return the location error, given both a location error and weather error", () => {
        const result = getActiveError(locationErrorMessage, weatherErrorMessage);

        expect(result).toEqual({
            title: "Unable to use your location",
            message: locationErrorMessage,
            type: "location",
        });
    });

    it("should return undefined, given no location or weather error", () => {
        const result = getActiveError();
        expect(result).toBeUndefined();
    });
});
