type CoordinateParseResult =
    { ok: true; latitude: number; longitude: number } | { ok: false; error: string };

export const parseCoordinates = (
    latitude: string | null,
    longitude: string | null,
): CoordinateParseResult => {
    if (!latitude || !longitude) return { ok: false, error: "Missing lat/lng" };

    const parsedLatitude = Number.parseFloat(latitude);
    const parsedLongitude = Number.parseFloat(longitude);

    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
        return { ok: false, error: "Invalid lat/lng values" };
    }

    if (Math.abs(parsedLatitude) > 90 || Math.abs(parsedLongitude) > 180) {
        return { ok: false, error: "Coordinates out of range" };
    }

    return {
        ok: true,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
    };
};
