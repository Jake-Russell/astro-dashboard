import { getFormattedTime, getLocalTime, isBodyUp, isCurrentlyPrime } from "../timeUtils";
import { mockLat, mockLng } from "../../mocks/mockWeatherData";

describe("timeUtils", () => {
    const tokyoLat = 35.6762;
    const tokyoLng = 139.6503;
    const newYorkLat = 40.7128;
    const newYorkLng = -74.006;
    let epoch: number;

    beforeEach(() => {
        vi.setSystemTime(new Date("2025-01-01T15:00:00Z")); // 3 PM
        epoch = new Date("2025-01-01T12:00:00Z").getTime() / 1000; // 12 PM
    });

    beforeAll(() => vi.useFakeTimers());

    afterAll(() => vi.useRealTimers());

    describe("getLocalTime", () => {
        it("should convert epoch to a Date representing the same UTC instant, given an epoch timestamp and coordinates", () => {
            const localTime = getLocalTime(epoch, mockLat, mockLng);

            expect(localTime).toBeInstanceOf(Date);
            expect(Math.floor(localTime.getTime() / 1000)).toBe(epoch);
        });

        it("should convert UTC epoch to correct local time per timezone, given location coordinates", () => {
            const londonTime = getLocalTime(epoch, 51.5074, -0.1278);
            const tokyoTime = getLocalTime(epoch, tokyoLat, tokyoLng);
            const newYorkTime = getLocalTime(epoch, newYorkLat, newYorkLng);

            expect(tokyoTime.getHours()).toBe((londonTime.getHours() + 9) % 24);
            expect(newYorkTime.getHours()).toBe((londonTime.getHours() - 5) % 24);
        });

        it("should reflect daylight saving time changes in local hour values, given epoch timestamps", () => {
            const winter = new Date("2025-01-15T12:00:00Z").getTime() / 1000;
            const summer = new Date("2025-07-15T12:00:00Z").getTime() / 1000;

            const winterTime = getLocalTime(winter, mockLat, mockLng);
            const summerTime = getLocalTime(summer, mockLat, mockLng);

            expect(winterTime.getTime()).toBe(new Date(winter * 1000).getTime());
            expect(summerTime.getTime()).toBe(new Date(summer * 1000).getTime());

            const offsetDiff = summerTime.getHours() - winterTime.getHours();
            expect(Math.abs(offsetDiff)).toBe(1);
        });

        it("should return consistent results for locations within the same timezone, given identical epoch", () => {
            const oxfordTime = getLocalTime(epoch, 51.75, -1.25);
            const londonTime = getLocalTime(epoch, mockLat, mockLng);

            expect(oxfordTime.getTime()).toBe(londonTime.getTime());
        });
    });

    describe("getFormattedTime", () => {
        it("should return a string in HH:mm format, given an epoch timestamp and coordinates", () => {
            const result = getFormattedTime(epoch, mockLat, mockLng);

            expect(typeof result).toBe("string");
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        it("should format time using local timezone, given different coordinates", () => {
            const londonTime = getFormattedTime(epoch, mockLat, mockLng);
            const tokyoTime = getFormattedTime(epoch, tokyoLat, tokyoLng);
            const newYorkTime = getFormattedTime(epoch, newYorkLat, newYorkLng);

            expect(londonTime).toBe("12:00");
            expect(tokyoTime).toBe("21:00");
            expect(newYorkTime).toBe("07:00");
        });

        it("should zero-pad hours and minutes correctly, given early morning timestamps", () => {
            epoch = new Date("2025-01-01T00:05:00Z").getTime() / 1000;

            const result = getFormattedTime(epoch, mockLat, mockLng);
            expect(result).toMatch(/^\d{2}:\d{2}$/);
            expect(result).toBe("00:05");
        });
    });

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
