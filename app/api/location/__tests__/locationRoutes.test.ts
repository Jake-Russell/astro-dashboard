import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET as searchGET } from "../search/route";
import { GET as reverseGET } from "../reverse/route";
import { NextRequest } from "next/server";

describe("Location API routes", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("GET /api/location/search", () => {
        let request: NextRequest;
        beforeEach(() => {
            request = new NextRequest("https://example.com/api/location/search?location=Swindon");
        });

        it("should return 400, given location is missing", async () => {
            request = new NextRequest("https://example.com/api/location/search");

            const response = await searchGET(request);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Location parameter is required" });
        });

        it("should return Nominatim API errors as-is", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                status: 502,
                json: vi.fn().mockResolvedValueOnce({}),
            });

            const response = await searchGET(request);

            expect(response.status).toBe(502);
            expect(await response.json()).toEqual({ error: "Nominatim API Error: 502" });
        });

        it("should return 404, given no locations are found", async () => {
            fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValueOnce([]) });

            const response = await searchGET(request);

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({
                error: "No location found for the given search term",
            });
        });

        it("should return formatted location, given the external API succeeds", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce([
                    {
                        lat: "51.75",
                        lon: "-1.25",
                        display_name: "Swindon, Wiltshire, UK",
                    },
                ]),
            });

            const response = await searchGET(request);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                lat: "51.75",
                lon: "-1.25",
                displayName: "Swindon, UK",
            });
        });

        it("should return 500 when fetch throws", async () => {
            fetchMock.mockRejectedValueOnce(new Error("Network failure"));

            const response = await searchGET(request);

            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({
                error: "Network error: Network failure",
            });
        });
    });

    describe("GET /api/location/reverse", () => {
        let request: NextRequest;
        beforeEach(() => {
            request = new NextRequest(
                "https://example.com/api/location/reverse?lat=51.75&lon=-1.25",
            );
        });

        it.each([
            "https://example.com/api/location/reverse?lat=51.75",
            "https://example.com/api/location/reverse?lon=-1.25",
        ])("should return 400 when lat or lon are missing", async (url) => {
            request = new NextRequest(url);

            const response = await reverseGET(request);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Lat and Lon parameters are required" });
        });

        it("should return Nominatim API errors as-is", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                status: 503,
                json: vi.fn().mockResolvedValueOnce({}),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(503);
            expect(await response.json()).toEqual({ error: "Nominatim API Error: 503" });
        });

        it("should return 404, given no reverse location is found", async () => {
            fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValueOnce({}) });

            const response = await reverseGET(request);

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({
                error: "No location found for the given coordinates",
            });
        });

        it("should return formatted reverse location, given the external API succeeds", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce({
                    display_name: "Swindon, Wiltshire, UK",
                    address: {
                        town: "Swindon",
                        country: "United Kingdom",
                    },
                }),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                name: "Swindon",
                displayName: "Swindon, United Kingdom",
            });
        });

        it("should return 500 when fetch throws", async () => {
            fetchMock.mockRejectedValueOnce(new Error("Network failure"));

            const response = await reverseGET(request);

            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({
                error: "Network error: Network failure",
            });
        });
    });
});
