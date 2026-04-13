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
    });
});
