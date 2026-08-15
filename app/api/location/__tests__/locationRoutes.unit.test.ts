import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@vercel/firewall";
import { mockLat, mockLng } from "../../../mocks/mockLocationData";
import { GET as searchGET } from "../search/route";
import { GET as reverseGET } from "../reverse/route";

vi.mock("@vercel/firewall", () => ({
    checkRateLimit: vi.fn(),
}));

describe("Location API routes", () => {
    const fetchMock = vi.fn();
    const checkRateLimitMock = vi.mocked(checkRateLimit);

    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
        checkRateLimitMock.mockReset();
        checkRateLimitMock.mockResolvedValue({ rateLimited: false });
    });

    afterEach(() => vi.unstubAllGlobals());

    describe("shared Nominatim rate limit bucket", () => {
        it("should use the same rate limit key for both search and reverse routes", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                json: vi
                    .fn()
                    .mockResolvedValue([
                        { lat: mockLat, lon: mockLng, display_name: "Swindon, Wiltshire, UK" },
                    ]),
            });
            await searchGET(
                new NextRequest("https://example.com/api/location/search?location=Swindon"),
            );
            const searchKey = checkRateLimitMock.mock.calls[0][1]?.rateLimitKey;

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({
                    display_name: "Swindon, Wiltshire, UK",
                    address: { town: "Swindon", country: "United Kingdom" },
                }),
            });
            await reverseGET(
                new NextRequest(
                    `https://example.com/api/location/reverse?lat=${mockLat}&lon=${mockLng}`,
                ),
            );
            const reverseKey = checkRateLimitMock.mock.calls[1][1]?.rateLimitKey;

            expect(searchKey).toBe("nominatim");
            expect(reverseKey).toBe("nominatim");
            expect(searchKey).toBe(reverseKey);
        });
    });

    describe("GET /api/location/search", () => {
        let request: NextRequest;
        beforeEach(() => {
            request = new NextRequest("https://example.com/api/location/search?location=Swindon");
        });

        describe("rate limiting", () => {
            it("should return 429 and skip the upstream call, given the request is rate limited", async () => {
                checkRateLimitMock.mockResolvedValueOnce({ rateLimited: true });
                const response = await searchGET(request);
                expect(response.status).toBe(429);
                expect(await response.json()).toEqual({
                    error: "Too many requests, please try again shortly.",
                });
                expect(fetchMock).not.toHaveBeenCalled();
            });

            it("should key the rate limit check by the shared 'nominatim' bucket, not client IP", async () => {
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: vi
                        .fn()
                        .mockResolvedValueOnce([
                            { lat: mockLat, lon: mockLng, display_name: "Swindon, Wiltshire, UK" },
                        ]),
                });

                request = new NextRequest(
                    "https://example.com/api/location/search?location=Swindon",
                    { headers: { "x-forwarded-for": "1.2.3.4" } },
                );

                await searchGET(request);

                expect(checkRateLimitMock).toHaveBeenCalledWith(
                    "api-rate-limit",
                    expect.objectContaining({ rateLimitKey: "nominatim" }),
                );
            });
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
                        lat: mockLat,
                        lon: mockLng,
                        display_name: "Swindon, Wiltshire, UK",
                    },
                ]),
            });

            const response = await searchGET(request);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                latitude: mockLat,
                longitude: mockLng,
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

        it("should stringify non-Error values from the fetch rejection", async () => {
            fetchMock.mockRejectedValueOnce("non-error rejection");

            const response = await searchGET(request);

            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({
                error: "Network error: non-error rejection",
            });
        });
    });

    describe("GET /api/location/reverse", () => {
        let request: NextRequest;
        beforeEach(() => {
            request = new NextRequest(
                `https://example.com/api/location/reverse?lat=${mockLat}&lon=${mockLng}`,
            );
        });

        describe("rate limiting", () => {
            it("should return 429 and skip the upstream call, given the request is rate limited", async () => {
                checkRateLimitMock.mockResolvedValueOnce({ rateLimited: true });

                const response = await reverseGET(request);

                expect(response.status).toBe(429);
                expect(await response.json()).toEqual({
                    error: "Too many requests, please try again shortly.",
                });
                expect(fetchMock).not.toHaveBeenCalled();
            });

            it("should key the rate limit check by the shared 'nominatim' bucket, not client IP", async () => {
                fetchMock.mockResolvedValueOnce({
                    ok: true,
                    json: vi.fn().mockResolvedValueOnce({
                        display_name: "Swindon, Wiltshire, UK",
                        address: { town: "Swindon", country: "United Kingdom" },
                    }),
                });

                request = new NextRequest(
                    `https://example.com/api/location/reverse?lat=${mockLat}&lon=${mockLng}`,
                    { headers: { "x-forwarded-for": "1.2.3.4" } },
                );

                await reverseGET(request);

                expect(checkRateLimitMock).toHaveBeenCalledWith(
                    "api-rate-limit",
                    expect.objectContaining({ rateLimitKey: "nominatim" }),
                );
            });
        });

        it.each([
            `https://example.com/api/location/reverse?lat=${mockLat}`,
            `https://example.com/api/location/reverse?lon=${mockLng}`,
        ])("should return 400 when lat or lon are missing", async (url) => {
            request = new NextRequest(url);

            const response = await reverseGET(request);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Missing lat/lon" });
        });

        it.each([
            `https://example.com/api/location/reverse?lat=not-a-number&lon=${mockLng}`,
            `https://example.com/api/location/reverse?lat=${mockLat}&lon=not-a-number`,
        ])("should return 400, given either lat or lon are invalid", async (url) => {
            request = new NextRequest(url);

            const response = await reverseGET(request);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Invalid lat/lon values" });
        });

        it.each([
            `https://example.com/api/location/reverse?lat=91&lon=${mockLng}`,
            `https://example.com/api/location/reverse?lat=-91&lon=${mockLng}`,
            `https://example.com/api/location/reverse?lat=${mockLat}&lon=181`,
            `https://example.com/api/location/reverse?lat=${mockLat}&lon=-181`,
        ])("should return 400, given either lat or lon are out of range", async (url) => {
            request = new NextRequest(url);

            const response = await reverseGET(request);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Coordinates out of range" });
        });

        it("should return 502, given the upstream provider responds with an error", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                status: 503,
                text: vi.fn().mockResolvedValueOnce("service unavailable"),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(502);
            expect(await response.json()).toEqual({
                error: "Nominatim API error: 503 service unavailable",
            });
        });

        it("should preserve non-5xx provider status codes for upstream client errors", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                status: 401,
                text: vi.fn().mockResolvedValueOnce("invalid api key"),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(401);
            expect(await response.json()).toEqual({
                error: "Nominatim API error: 401 invalid api key",
            });
        });

        it("should return 502 with the fallback message when upstream error body is empty", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: vi.fn().mockResolvedValueOnce(""),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(502);
            expect(await response.json()).toEqual({
                error: "Nominatim API error: 500 unknown",
            });
        });

        it("should return 504, given the fetch throws", async () => {
            fetchMock.mockRejectedValueOnce(new Error("Timeout"));

            const response = await reverseGET(request);

            expect(response.status).toBe(504);
            expect(await response.json()).toEqual({
                error: "Network error: Timeout",
            });
        });

        it("should stringify non-Error values from the fetch rejection", async () => {
            fetchMock.mockRejectedValueOnce("non-error rejection");

            const response = await reverseGET(request);

            expect(response.status).toBe(504);
            expect(await response.json()).toEqual({
                error: "Network error: non-error rejection",
            });
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

        it("should fall back to city, given village and town are missing", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce({
                    display_name: "Bath, Somerset, UK",
                    address: {
                        city: "Bath",
                        country: "United Kingdom",
                    },
                }),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                name: "Bath",
                displayName: "Bath, United Kingdom",
            });
        });

        it("should fall back to unknown location, given the address has no known locality fields", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce({
                    display_name: "Somewhere remote, UK",
                    address: {
                        country: "United Kingdom",
                    },
                }),
            });

            const response = await reverseGET(request);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                name: "Unknown location",
                displayName: "Unknown location, United Kingdom",
            });
        });
    });
});
