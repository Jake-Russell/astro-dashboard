import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { mockLat, mockLng } from "../../../mocks/mockLocationData";
import { mockWeatherResponse } from "../../../mocks/mockWeatherData";
import { GET } from "../route";

describe("Weather API route", () => {
    const fetchMock = vi.fn();
    let request: NextRequest;

    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
        process.env.OPEN_WEATHER_MAP_APP_ID = "test-weather-key";
        request = new NextRequest(`https://example.com/api/weather?lat=${mockLat}&lon=${mockLng}`);
    });

    afterEach(() => vi.unstubAllGlobals());

    it.each([
        `https://example.com/api/weather?lat=${mockLat}`,
        `https://example.com/api/weather?lon=${mockLng}`,
    ])("should return 400, given either lat or lon are missing", async (url) => {
        request = new NextRequest(url);

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Missing lat/lon" });
    });

    it.each([
        `https://example.com/api/weather?lat=not-a-number&lon=${mockLng}`,
        `https://example.com/api/weather?lat=${mockLat}&lon=not-a-number`,
    ])("should return 400, given either lat or lon are invalid", async (url) => {
        request = new NextRequest(url);

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Invalid lat/lon values" });
    });

    it.each([
        `https://example.com/api/weather?lat=91&lon=${mockLng}`,
        `https://example.com/api/weather?lat=-91&lon=${mockLng}`,
        `https://example.com/api/weather?lat=${mockLat}&lon=181`,
        `https://example.com/api/weather?lat=${mockLat}&lon=-181`,
    ])("should return 400, given either lat or lon are out of range", async (url) => {
        request = new NextRequest(url);

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Coordinates out of range" });
    });

    it("should return 502, given the upstream provider responds with an error", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 503,
            text: vi.fn().mockResolvedValueOnce("service unavailable"),
        });

        const response = await GET(request);

        expect(response.status).toBe(502);
        expect(await response.json()).toEqual({
            error: "Weather provider error: 503 service unavailable",
        });
    });

    it("should preserve non-5xx provider status codes for upstream client errors", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: vi.fn().mockResolvedValueOnce("invalid api key"),
        });

        const response = await GET(request);

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({
            error: "Weather provider error: 401 invalid api key",
        });
    });

    it("should return 502 with the fallback message when upstream error body is empty", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: vi.fn().mockResolvedValueOnce(""),
        });

        const response = await GET(request);

        expect(response.status).toBe(502);
        expect(await response.json()).toEqual({
            error: "Weather provider error: 500 unknown",
        });
    });

    it("should return 500, given the required API key is missing", async () => {
        delete process.env.OPEN_WEATHER_MAP_APP_ID;

        const response = await GET(request);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            error: "Missing required environment variable: OPEN_WEATHER_MAP_APP_ID. Add it to your .env file or deployment environment before starting the app.",
        });
    });

    it("should return 504, given the fetch throws", async () => {
        fetchMock.mockRejectedValueOnce(new Error("Timeout"));

        const response = await GET(request);

        expect(response.status).toBe(504);
        expect(await response.json()).toEqual({
            error: "Network error: Timeout",
        });
    });

    it("should stringify non-Error values from the fetch rejection", async () => {
        fetchMock.mockRejectedValueOnce("non-error rejection");

        const response = await GET(request);

        expect(response.status).toBe(504);
        expect(await response.json()).toEqual({
            error: "Network error: non-error rejection",
        });
    });

    it("should return the weather data when the upstream provider succeeds", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValueOnce(mockWeatherResponse),
        });

        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(mockWeatherResponse);
    });
});
