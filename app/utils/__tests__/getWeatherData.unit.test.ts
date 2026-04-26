import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WeatherResponse } from "api/weather/route";
import { mockLat, mockLng } from "../../mocks/mockLocationData";
import { mockWeatherResponse } from "../../mocks/mockWeatherData";
import { getWeatherData } from "../getWeatherData";

describe("getWeatherData", () => {
    const baseErrorResponse: WeatherResponse = {
        lat: 0,
        lon: 0,
        current: { dt: 0, sunrise: 0, sunset: 0, clouds: 0, visibility: 0, weather: [] },
        hourly: [],
        daily: [],
    };

    beforeEach(() => vi.resetAllMocks());
    afterEach(() => vi.restoreAllMocks());

    it("should return weather data, given the API responds successfully", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockWeatherResponse,
            }),
        );

        const result = await getWeatherData(mockLat.toString(), mockLng.toString());

        expect(fetch).toHaveBeenCalledWith(`/api/weather?lat=${mockLat}&lng=${mockLng}`);
        expect(result).toEqual(mockWeatherResponse);
    });

    it("should return error response, given API returns non-ok response", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: "Bad request" }),
            }),
        );

        const result = await getWeatherData(mockLat.toString(), mockLng.toString());

        expect(result).toEqual({ ...baseErrorResponse, error: "Bad request" });
    });

    it("should return fallback error message, given API returns non-ok response without error field", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({}),
            }),
        );

        const result = await getWeatherData(mockLat.toString(), mockLng.toString());

        expect(result).toEqual({ ...baseErrorResponse, error: "API error" });
    });

    it("should return network error, given fetch throws", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network fail")));

        const result = await getWeatherData(mockLat.toString(), mockLng.toString());

        expect(result).toEqual({
            ...baseErrorResponse,
            error: "Network error: Error: Network fail",
        });
    });
});
