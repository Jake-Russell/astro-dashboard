import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { getLatLng, getLocationName } from "../getLocationData";

describe("getLocationData", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).fetch = fetchMock;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("getLatLng", () => {
        it("should return location data, given the API responds successfully", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce({
                    lat: "51.75",
                    lon: "-1.25",
                    displayName: "Swindon, UK",
                }),
            });

            const result = await getLatLng("Swindon");

            expect(fetchMock).toHaveBeenCalledWith("/api/location/search?location=Swindon");
            expect(result).toEqual({
                lat: "51.75",
                lon: "-1.25",
                displayName: "Swindon, UK",
            });
        });

        it("should return an error payload, given the API responds with a non-ok status", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                json: vi.fn().mockResolvedValueOnce({ error: "Location not found" }),
            });

            const result = await getLatLng("Unknown Place");

            expect(result).toEqual({
                lat: "",
                lon: "",
                displayName: "",
                error: "Location not found",
            });
        });

        it("should return a network error payload, given fetch throws", async () => {
            fetchMock.mockRejectedValueOnce(new Error("Network failure"));

            const result = await getLatLng("Swindon");

            expect(result).toEqual({
                lat: "",
                lon: "",
                displayName: "",
                error: "Network error: Error: Network failure",
            });
        });
    });

    describe("getLocationName", () => {
        it("should return reverse geocoding data, given the API responds successfully", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce({
                    name: "Swindon",
                    displayName: "Swindon, Wiltshire, UK",
                }),
            });

            const result = await getLocationName("51.75", "-1.25");

            expect(fetchMock).toHaveBeenCalledWith("/api/location/reverse?lat=51.75&lon=-1.25");
            expect(result).toEqual({
                name: "Swindon",
                displayName: "Swindon, Wiltshire, UK",
            });
        });

        it("should return an error payload, given the reverse API responds with a non-ok status", async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                json: vi.fn().mockResolvedValueOnce({ error: "Reverse lookup failed" }),
            });

            const result = await getLocationName("51.75", "-1.25");

            expect(result).toEqual({
                name: "",
                displayName: "",
                error: "Reverse lookup failed",
            });
        });

        it("should return a network error payload, given fetch throws", async () => {
            fetchMock.mockRejectedValueOnce(new Error("Network failure"));

            const result = await getLocationName("51.75", "-1.25");

            expect(result).toEqual({
                name: "",
                displayName: "",
                error: "Network error: Error: Network failure",
            });
        });
    });
});
