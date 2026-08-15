import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockLat, mockLng } from "../../mocks/mockLocationData";
import { getCurrentPosition } from "../geolocationService";

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

        it("should reject with unsupported error, given geolocation is not supported by browser", async () => {
            vi.stubGlobal("navigator", {
                geolocation: undefined,
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: "UNSUPPORTED",
                message: "Your browser does not support device location.",
            });
        });

        it("should resolve with rounded numeric coordinates, given geolocation succeeds", async () => {
            const getCurrentPositionMock = vi
                .fn()
                .mockImplementation((success: PositionCallback) => {
                    success({
                        coords: {
                            latitude: mockLat,
                            longitude: mockLng,
                        },
                    } as GeolocationPosition);
                });

            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: getCurrentPositionMock,
                },
            });

            const result = await getCurrentPosition();

            expect(getCurrentPositionMock).toHaveBeenCalledWith(
                expect.any(Function),
                expect.any(Function),
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000,
                },
            );

            expect(result).toEqual({
                latitude: Number(mockLat.toFixed(5)),
                longitude: Number(mockLng.toFixed(5)),
            });
        });

        it("should reject with permission denied error, given PERMISSION_DENIED error", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (
                        _success: PositionCallback,
                        reject: PositionErrorCallback,
                    ) => {
                        reject({
                            ...baseRejectionResponse,
                            code: baseRejectionResponse.PERMISSION_DENIED,
                        });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: "PERMISSION_DENIED",
                message:
                    "Location permission was denied. You can enable location access in your browser settings, or search for a location instead.",
            });
        });

        it("should reject with position unavailable error, given POSITION_UNAVAILABLE error", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (
                        _success: PositionCallback,
                        reject: PositionErrorCallback,
                    ) => {
                        reject({
                            ...baseRejectionResponse,
                            code: baseRejectionResponse.POSITION_UNAVAILABLE,
                        });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: "POSITION_UNAVAILABLE",
                message:
                    "Your device's location could not be determined. Please try again or search for a location instead.",
            });
        });

        it("should reject with timeout error, given TIMEOUT error", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (
                        _success: PositionCallback,
                        reject: PositionErrorCallback,
                    ) => {
                        reject({
                            ...baseRejectionResponse,
                            code: baseRejectionResponse.TIMEOUT,
                        });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: "TIMEOUT",
                message:
                    "We couldn't get your location in time. Please try again or search for a location instead.",
            });
        });

        it("should reject with position unavailable error, given an unknown error code", async () => {
            vi.stubGlobal("navigator", {
                geolocation: {
                    getCurrentPosition: (
                        _success: PositionCallback,
                        reject: PositionErrorCallback,
                    ) => {
                        reject({
                            ...baseRejectionResponse,
                            code: 999,
                        });
                    },
                },
            });

            await expect(getCurrentPosition()).rejects.toEqual({
                code: "POSITION_UNAVAILABLE",
                message:
                    "Unable to retrieve your location. Please try again or search for a location instead.",
            });
        });
    });
});
