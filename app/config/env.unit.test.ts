import { afterEach, describe, expect, it } from "vitest";
import { getEnv } from "./env";

describe("env config", () => {
    const originalEnv = process.env.OPEN_WEATHER_MAP_APP_ID;

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.OPEN_WEATHER_MAP_APP_ID;
        } else {
            process.env.OPEN_WEATHER_MAP_APP_ID = originalEnv;
        }
    });

    it("should throw, given the OpenWeather API key is missing", () => {
        delete process.env.OPEN_WEATHER_MAP_APP_ID;

        expect(() => getEnv()).toThrow(
            "Missing required environment variable: OPEN_WEATHER_MAP_APP_ID",
        );
    });

    it("should return the configured API key when present", () => {
        process.env.OPEN_WEATHER_MAP_APP_ID = "test-key";

        expect(getEnv().weatherApiKey).toBe("test-key");
    });
});
