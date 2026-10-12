import { describe, expect, it } from "vitest";
import type { HourlyAstroScore } from "molecules/AstroScoreCard";
import { buildNightScoreChart, getActiveHighlightPath } from "./chartGeometry";

const makeScore = (time: number, score: number): HourlyAstroScore => ({
    time,
    endTime: time + 3600,
    score,
    breakdown: {
        cloud: 0,
        moon: { total: 0, illumination: 0, altitude: 0 },
    },
    cloudCoverage: 0,
    moonAltitude: 0,
});

describe("buildNightScoreChart", () => {
    it("returns undefined when there are no hourly scores", () => {
        expect(buildNightScoreChart([], undefined, undefined, 0, 0)).toBeUndefined();
    });

    it("places points at hour midpoints and ranges at hour boundaries", () => {
        const chart = buildNightScoreChart([makeScore(0, 4), makeScore(3600, 8)], 1800, 5400, 0, 0);

        expect(chart).toBeDefined();
        expect(chart?.points[0].rangeX).toBe(24);
        expect(chart?.points[0].x).toBe(112);
        expect(chart?.points[1].rangeX).toBe(200);
        expect(chart?.points[1].x).toBe(288);
        expect(chart?.primeRect).toEqual({ x: 112, width: 176 });
    });
});

describe("getActiveHighlightPath", () => {
    it("returns undefined for an invalid active index", () => {
        const chart = buildNightScoreChart([makeScore(0, 4)], undefined, undefined, 0, 0);

        expect(chart).toBeDefined();
        expect(getActiveHighlightPath(chart!, 1)).toBeUndefined();
    });
});
