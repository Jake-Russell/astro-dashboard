import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { mockWeatherResponse } from "mocks/mockWeatherData";

describe("Weather API route", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
        process.env.OPEN_WEATHER_MAP_APP_ID = "test-weather-key";
    });

    afterEach(() => vi.unstubAllGlobals());

    it("should return 400, given lat is missing", async () => {
        const request = new NextRequest(`https://example.com/api/weather?lng=${mockLng}`);

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Missing lat/lng" });
    });

    it("should return 400, given lng is missing", async () => {
        const request = new NextRequest(`https://example.com/api/weather?lat=${mockLat}`);

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Missing lat/lng" });
    });

    it("should return 400, given lat is invalid", async () => {
        const request = new NextRequest(
            `https://example.com/api/weather?lat=not-a-number&lng=${mockLng}`,
        );

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Invalid lat/lng values" });
    });

    it("should return 400, given lng is invalid", async () => {
        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=not-a-number`,
        );

        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Invalid lat/lng values" });
    });

    it.each([
        ["90.1", "0"],
        ["-90.1", "0"],
        ["0", "180.1"],
        ["0", "-180.1"],
    ])("should return 400, given coordinates are out of range (%s, %s)", async (lat, lng) => {
        const request = new NextRequest(`https://example.com/api/weather?lat=${lat}&lng=${lng}`);

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

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

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

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

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

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

        const response = await GET(request);

        expect(response.status).toBe(502);
        expect(await response.json()).toEqual({
            error: "Weather provider error: 500 unknown",
        });
    });

    it("should return 500, given the required API key is missing", async () => {
        delete process.env.OPEN_WEATHER_MAP_APP_ID;

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

        const response = await GET(request);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            error: "Missing required environment variable: OPEN_WEATHER_MAP_APP_ID. Add it to your .env file or deployment environment before starting the app.",
        });
    });

    it("should return 504, given the fetch throws", async () => {
        fetchMock.mockRejectedValueOnce(new Error("Timeout"));

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

        const response = await GET(request);

        expect(response.status).toBe(504);
        expect(await response.json()).toEqual({
            error: "Network error: Timeout",
        });
    });

    it("should stringify non-Error values from the fetch rejection", async () => {
        fetchMock.mockRejectedValueOnce("non-error rejection");

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

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

        const request = new NextRequest(
            `https://example.com/api/weather?lat=${mockLat}&lng=${mockLng}`,
        );

        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(mockWeatherResponse);
    });
});
