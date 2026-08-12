import { describe, it, expect } from "vitest";
import { parseCoordinates } from "./parseCoordinates";
import { mockLat, mockLng } from "mocks/mockLocationData";

describe("parseCoordinates", () => {
    it("should return error, given either coordinate is missing", () => {
        expect(parseCoordinates(mockLat.toString(), null)).toEqual({
            ok: false,
            error: "Missing lat/lon",
        });

        expect(parseCoordinates(null, mockLng.toString())).toEqual({
            ok: false,
            error: "Missing lat/lon",
        });
    });

    it("should return error, given values are not numeric", () => {
        expect(parseCoordinates("abc", mockLng.toString())).toEqual({
            ok: false,
            error: "Invalid lat/lon values",
        });

        expect(parseCoordinates(mockLat.toString(), "invalid")).toEqual({
            ok: false,
            error: "Invalid lat/lon values",
        });
    });

    it("should return error, given coordinates are out of range", () => {
        expect(parseCoordinates("91", "0")).toEqual({
            ok: false,
            error: "Coordinates out of range",
        });

        expect(parseCoordinates("0", "181")).toEqual({
            ok: false,
            error: "Coordinates out of range",
        });
    });

    it("should return the parsed numeric coordinates when valid", () => {
        expect(parseCoordinates(mockLat.toString(), mockLng.toString())).toEqual({
            ok: true,
            latitude: mockLat,
            longitude: mockLng,
        });
    });
});
