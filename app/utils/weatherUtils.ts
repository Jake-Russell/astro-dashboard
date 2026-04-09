export const getCloudScore = (nightCloudCoverage: number[]): number => {
    const avgCloud = nightCloudCoverage.reduce((a, b) => a + b, 0) / nightCloudCoverage.length;
    const score = 10 * (1 - avgCloud / 100); // 0 clouds → 10, 100% clouds → 0
    return Math.max(0, Math.min(10, score));
};

export const getMoonIlluminationScore = (illumination: number): number => {
    const score = 10 * (1 - illumination / 100); // 0% → 10, 100% → 0
    return Math.max(0, Math.min(10, score));
};

export const getMoonVisibilityScore = (moonUpMins: number, nightMins: number): number => {
    const fractionUp = moonUpMins / nightMins;
    const score = 10 * (1 - fractionUp); // Less moon time → higher score
    return Math.max(0, Math.min(10, score));
};

export const getAstroScore = (
    nightCloudCoverage: number[],
    moonIllumination: number,
    moonUpMins: number,
    nightMins: number,
) => {
    const cloudScore = getCloudScore(nightCloudCoverage);
    const illumScore = getMoonIlluminationScore(moonIllumination);
    const moonVisScore = getMoonVisibilityScore(moonUpMins, nightMins);

    const total = cloudScore * 0.5 + illumScore * 0.3 + moonVisScore * 0.2;

    return Math.round(total * 10) / 10; // round to 1 decimal place
};
