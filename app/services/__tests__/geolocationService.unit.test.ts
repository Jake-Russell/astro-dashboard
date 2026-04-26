import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCurrentPosition } from "../geolocationService";
import { mockLat, mockLng } from "../../mocks/mockLocationData";

describe("geolocationService", () => {
    describe("getCurrentPosition", () => {
        const baseRejectionResponse: GeolocationPositionError = {
            code: 1,
            message: "ignored",
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
        };

        beforeEach(() => vi.resetAllMocks());
        afterEach(() => vi.restoreAllMocks());

        it("should reject, given geolocation is not supported by browser", async () => {
            vi.stubGlobal("navigator", { geolocation: undefined });
            await expect(getCurrentPosition()).rejects.toEqual({
                message: "Geolocation is not supported by your browser.",
            });
        });

        it("should resolve with formatted coordinates, given geolocation succeeds", async () => {
            const getCurrentPositionMock = vi
                .fn()
                .mockImplementation((success: PositionCallback) => {
                    success({
                        coords: { latitude: mockLat, longitude: mockLng },
                    } as GeolocationPosition);
                });

            vi.stubGlobal("navigator", {
                geolocation: { getCurrentPosition: getCurrentPositionMock },
            });

            const result = await getCurrentPosition();

            expect(getCurrentPositionMock).toHaveBeenCalled();
            expect(result).toEqual({ latitude: mockLat.toFixed(5), longitude: mockLng.toFixed(5) });
        });

        it("should reject with permission denied message, given PERMISSION_DENIED error", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (_: PositionCallback, reject: PositionErrorCallback) => {
                        reject({ ...baseRejectionResponse, code: 1 });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: 1,
                message: "Location permission was denied.",
            });
        });

        it("should reject with position unavailable message, given permission is unavailable", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (_: PositionCallback, reject: PositionErrorCallback) => {
                        reject({ ...baseRejectionResponse, code: 2 });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: 2,
                message: "Your location could not be determined.",
            });
        });

        it("should reject with timeout message, given request timeout", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (_: PositionCallback, reject: PositionErrorCallback) => {
                        reject({ ...baseRejectionResponse, code: 3 });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: 3,
                message:
                    "We couldn't get your location in time. Please try again or search for a location instead.",
            });
        });

        it("should reject with default message, given unknown error code", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (_: PositionCallback, reject: PositionErrorCallback) => {
                        reject({ ...baseRejectionResponse, code: 999 });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: 999,
                message: "Unable to retrieve your location.",
            });
        });
    });
});
