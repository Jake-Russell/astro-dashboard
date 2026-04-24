import { mockLat, mockLng } from "mocks/mockWeatherData";
import { isBodyUp, isCurrentlyPrime } from "../timeUtils";

describe("timeUtils", () => {
    beforeEach(() => {
        vi.setSystemTime(new Date("2025-01-01T15:00:00Z")); // 3 PM
    });

    beforeAll(() => vi.useFakeTimers());

    afterAll(() => vi.useRealTimers());

    describe("isCurrentlyPrime", () => {
        let primeTimeStartEpoch: number;
        let primeTimeEndEpoch: number;

        beforeEach(() => {
            primeTimeStartEpoch = new Date("2025-01-01T21:00:00Z").getTime() / 1000; // 9 PM
            primeTimeEndEpoch = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
        });

        it("should return true, given time is between primeTimeStart and primeTimeEnd", () => {
            vi.setSystemTime(new Date("2025-01-01T22:00:00Z")); // 10 PM
            expect(isCurrentlyPrime(primeTimeStartEpoch, primeTimeEndEpoch, mockLat, mockLng)).toBe(
                true,
            );
        });

        it("should return false, given time is before primeTimeStart", () => {
            expect(isCurrentlyPrime(primeTimeStartEpoch, primeTimeEndEpoch, mockLat, mockLng)).toBe(
                false,
            );
        });

        it("should return false, given time is after primeTimeEnd", () => {
            vi.setSystemTime(new Date("2025-01-01T23:30:00Z")); // 11:30 PM
            expect(isCurrentlyPrime(primeTimeStartEpoch, primeTimeEndEpoch, mockLat, mockLng)).toBe(
                false,
            );
        });

        it("should return true, given time is exactly at primeTimeStart", () => {
            vi.setSystemTime(new Date("2025-01-01T21:00:00Z")); // 9 PM
            expect(isCurrentlyPrime(primeTimeStartEpoch, primeTimeEndEpoch, mockLat, mockLng)).toBe(
                true,
            );
        });

        it("should return true, given time is exactly at primeTimeEnd", () => {
            vi.setSystemTime(new Date("2025-01-01T23:00:00Z")); // 11 PM
            expect(isCurrentlyPrime(primeTimeStartEpoch, primeTimeEndEpoch, mockLat, mockLng)).toBe(
                true,
            );
        });

        it("should evaluate time relative to the target location, not the user's location", () => {
            // UTC+9 (Tokyo)
            vi.setSystemTime(new Date("2025-01-02T07:00:00+09:00"));
            expect(isCurrentlyPrime(primeTimeStartEpoch, primeTimeEndEpoch, mockLat, mockLng)).toBe(
                true,
            );
        });

        it("should return false, given primeTimeStartEpoch is 0", () => {
            expect(isCurrentlyPrime(0, primeTimeEndEpoch, mockLat, mockLng)).toBe(false);
        });

        it("should return false, given primeTimeEndEpoch is 0", () => {
            expect(isCurrentlyPrime(primeTimeStartEpoch, 0, mockLat, mockLng)).toBe(false);
        });
    });

    describe("isBodyUp", () => {
        let bodyRise: number;
        let bodySet: number;

        beforeEach(() => {
            bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
            bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
        });

        describe("system time", () => {
            it("should return true, given bodyRise is in the past and bodySet is in the future", () => {
                bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
                bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(true);
            });

            it("should return false, given bodySet is in the past and bodyRise is in the future", () => {
                bodyRise = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 AM
                bodySet = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });

            it("should return false, given both bodyRise and bodySet are in the future and bodyRise is before bodySet", () => {
                bodyRise = new Date("2025-01-01T17:00:00Z").getTime() / 1000; // 5 PM
                bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });

            it("should return false and, given both bodyRise and bodySet are in the future and bodySet is before bodyRise", () => {
                bodyRise = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
                bodySet = new Date("2025-01-01T17:00:00Z").getTime() / 1000; // 5 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });

            it("should return false, given both bodyRise and bodySet are in the past and bodyRise is before bodySet", () => {
                bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
                bodySet = new Date("2025-01-01T11:00:00Z").getTime() / 1000; // 11 AM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });

            it("should return false, given both bodyRise and bodySet are in the past and bodySet is before bodyRise", () => {
                bodyRise = new Date("2025-01-01T11:00:00Z").getTime() / 1000; // 11 AM
                bodySet = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });

            it("should return false, given time is exactly at bodyRise", () => {
                bodyRise = new Date("2025-01-01T15:00:00Z").getTime() / 1000; // 3 PM
                bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });

            it("should return false, given time is exactly at bodySet", () => {
                bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
                bodySet = new Date("2025-01-01T15:00:00Z").getTime() / 1000; // 3 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng)).toBe(false);
            });
        });

        describe("timeEpoch provided", () => {
            let timeEpoch: number;

            beforeEach(() => {
                timeEpoch = new Date("2025-01-01T12:00:00Z").getTime() / 1000; // Noon
            });

            it("should return true, given timeEpoch is between bodyRise and bodySet", () => {
                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng, timeEpoch)).toBe(true);
            });

            it("should return false, given timeEpoch is before bodyRise", () => {
                timeEpoch = new Date("2025-01-01T04:00:00Z").getTime() / 1000; // 4 AM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng, timeEpoch)).toBe(false);
            });

            it("should return false, given timeEpoch is after bodySet", () => {
                const timeEpoch = new Date("2025-01-02T23:30:00Z").getTime() / 1000; // 11:30 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng, timeEpoch)).toBe(false);
            });

            it("should return false, given timeEpoch is exactly at bodyRise", () => {
                timeEpoch = bodyRise; // 6 AM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng, timeEpoch)).toBe(false);
            });

            it("should return false, given timeEpoch is exactly at bodySet", () => {
                timeEpoch = bodySet; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, mockLat, mockLng, timeEpoch)).toBe(false);
            });
        });
    });
});
