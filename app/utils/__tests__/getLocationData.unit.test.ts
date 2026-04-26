import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import type { LocationReverseResponse, LocationSearchResponse } from "api/location/types";
import { getLatLng, getLocationName } from "../getLocationData";
import {
    mockLat,
    mockLng,
    mockLocationReverseResponse,
    mockLocationSearchResponse,
} from "../../mocks/mockLocationData";

describe("getLocationData", () => {
    beforeEach(() => vi.resetAllMocks());
    afterEach(() => vi.restoreAllMocks());

    describe("getLatLng", () => {
        const baseErrorResponse: LocationSearchResponse = { lat: "", lon: "", displayName: "" };

        it("should return location data, given the API responds successfully", async () => {
            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => mockLocationSearchResponse,
                }),
            );

            const result = await getLatLng("London");

            expect(fetch).toHaveBeenCalledWith("/api/location/search?location=London");
            expect(result).toEqual(mockLocationSearchResponse);
        });

        it("should return error response, given API returns non-ok response", async () => {
            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    json: async () => ({ error: "Bad request" }),
                }),
            );

            const result = await getLatLng("London");

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

            const result = await getLatLng("London");

            expect(result).toEqual({ ...baseErrorResponse, error: "API error" });
        });

        it("should return network error, given fetch throws", async () => {
            vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network fail")));

            const result = await getLatLng("Swindon");

            expect(result).toEqual({
                ...baseErrorResponse,
                error: "Network error: Error: Network fail",
            });
        });
    });

    describe("getLocationName", () => {
        const baseErrorResponse: LocationReverseResponse = { name: "", displayName: "" };

        it("should return reverse geocoding data, given the API responds successfully", async () => {
            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => mockLocationReverseResponse,
                }),
            );

            const result = await getLocationName(mockLat.toString(), mockLng.toString());

            expect(fetch).toHaveBeenCalledWith(
                `/api/location/reverse?lat=${mockLat}&lon=${mockLng}`,
            );
            expect(result).toEqual(mockLocationReverseResponse);
        });

        it("should return error response, given API returns non-ok response", async () => {
            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    json: async () => ({ error: "Bad request" }),
                }),
            );

            const result = await getLocationName(mockLat.toString(), mockLng.toString());

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

            const result = await getLocationName(mockLat.toString(), mockLng.toString());

            expect(result).toEqual({ ...baseErrorResponse, error: "API error" });
        });

        it("should return network error, given fetch throws", async () => {
            vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network fail")));

            const result = await getLocationName(mockLat.toString(), mockLng.toString());

            expect(result).toEqual({
                ...baseErrorResponse,
                error: "Network error: Error: Network fail",
            });
        });
    });
});
