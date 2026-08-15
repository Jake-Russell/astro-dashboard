import { describe, it, expect } from "vitest";
import { rateLimitedResponse } from "../rateLimitResponse";

describe("rateLimitedResponse", () => {
    it("should return a 429 with the expected error shape, given a rate limit request", async () => {
        const res = rateLimitedResponse();
        expect(res.status).toBe(429);

        const body = await res.json();
        expect(body).toEqual({ error: "Too many requests, please try again shortly." });
    });
});
