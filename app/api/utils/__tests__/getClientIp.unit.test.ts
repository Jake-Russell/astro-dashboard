import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { getClientIp } from "../getClientIp";

function makeRequest(headers: Record<string, string> = {}) {
    return new NextRequest("https://example.com/api/weather", { headers });
}

describe("getClientIp", () => {
    it("should return the first IP, given x-forwarded-for header", () => {
        const req = makeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
        expect(getClientIp(req)).toBe("1.2.3.4");
    });

    it("should trim whitespace around the first IP, given x-forwarded-for header with whitespace", () => {
        const req = makeRequest({ "x-forwarded-for": "  1.2.3.4  , 5.6.7.8" });
        expect(getClientIp(req)).toBe("1.2.3.4");
    });

    it("should fall back to x-real-ip, given x-forwarded-for is absent", () => {
        const req = makeRequest({ "x-real-ip": "9.9.9.9" });
        expect(getClientIp(req)).toBe("9.9.9.9");
    });

    it("should prefer x-forwarded-for over x-real-ip, given both headers are present", () => {
        const req = makeRequest({ "x-forwarded-for": "1.2.3.4", "x-real-ip": "9.9.9.9" });
        expect(getClientIp(req)).toBe("1.2.3.4");
    });

    it("should return 'unknown', given neither header is present", () => {
        const req = makeRequest();
        expect(getClientIp(req)).toBe("unknown");
    });
});
