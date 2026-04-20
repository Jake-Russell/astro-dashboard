import { isBodyUp } from "../timeUtils";

describe("timeUtils", () => {
    let bodyRise: number;
    let bodySet: number;
    const lat = 51.75;
    const lon = -1.25;

    beforeEach(() => {
        bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
        bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
    });

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-01-01T15:00:00Z")); // 3 PM
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    describe("isBodyUp", () => {
        describe("system time", () => {
            it("should return true, given bodyRise is in the past and bodySet is in the future", () => {
                bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
                bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(true);
            });

            it("should return false, given bodySet is in the past and bodyRise is in the future", () => {
                bodyRise = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 AM
                bodySet = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });

            it("should return false, given both bodyRise and bodySet are in the future and bodyRise is before bodySet", () => {
                bodyRise = new Date("2025-01-01T17:00:00Z").getTime() / 1000; // 5 PM
                bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });

            it("should return false and, given both bodyRise and bodySet are in the future and bodySet is before bodyRise", () => {
                bodyRise = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM
                bodySet = new Date("2025-01-01T17:00:00Z").getTime() / 1000; // 5 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });

            it("should return false, given both bodyRise and bodySet are in the past and bodyRise is before bodySet", () => {
                bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
                bodySet = new Date("2025-01-01T11:00:00Z").getTime() / 1000; // 11 AM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });

            it("should return false, given both bodyRise and bodySet are in the past and bodySet is before bodyRise", () => {
                bodyRise = new Date("2025-01-01T11:00:00Z").getTime() / 1000; // 11 AM
                bodySet = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });

            it("should return false, given time is exactly at bodyRise", () => {
                bodyRise = new Date("2025-01-01T15:00:00Z").getTime() / 1000; // 3 PM
                bodySet = new Date("2025-01-01T23:00:00Z").getTime() / 1000; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });

            it("should return false, given time is exactly at bodySet", () => {
                bodyRise = new Date("2025-01-01T06:00:00Z").getTime() / 1000; // 6 AM
                bodySet = new Date("2025-01-01T15:00:00Z").getTime() / 1000; // 3 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon)).toBe(false);
            });
        });

        describe("timeEpoch provided", () => {
            let timeEpoch: number;

            beforeEach(() => {
                timeEpoch = new Date("2025-01-01T12:00:00Z").getTime() / 1000; // Noon
            });

            it("should return true, given timeEpoch is between bodyRise and bodySet", () => {
                expect(isBodyUp(bodyRise, bodySet, lat, lon, timeEpoch)).toBe(true);
            });

            it("should return false, given timeEpoch is before bodyRise", () => {
                timeEpoch = new Date("2025-01-01T04:00:00Z").getTime() / 1000; // 4 AM

                expect(isBodyUp(bodyRise, bodySet, lat, lon, timeEpoch)).toBe(false);
            });

            it("should return false, given timeEpoch is after bodySet", () => {
                const timeEpoch = new Date("2025-01-02T23:30:00Z").getTime() / 1000; // 11:30 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon, timeEpoch)).toBe(false);
            });

            it("should return false, given timeEpoch is exactly at bodyRise", () => {
                timeEpoch = bodyRise; // 6 AM

                expect(isBodyUp(bodyRise, bodySet, lat, lon, timeEpoch)).toBe(false);
            });

            it("should return false, given timeEpoch is exactly at bodySet", () => {
                timeEpoch = bodySet; // 11 PM

                expect(isBodyUp(bodyRise, bodySet, lat, lon, timeEpoch)).toBe(false);
            });
        });
    });
});
