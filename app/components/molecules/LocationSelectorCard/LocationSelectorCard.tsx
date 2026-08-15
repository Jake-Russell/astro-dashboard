"use client";
import { type FunctionComponent, useEffect, useState } from "react";
import { Tile } from "atoms";
import { useAstronomy } from "contexts/AstronomyContext";
import { type GeolocationErrorCode, getCurrentPosition } from "services/geolocationService";
import { getLatLng, getLocationName } from "utils/getLocationData";

export const LocationSelectorCard: FunctionComponent = () => {
    const { loadingState, setLoadingState, weatherDataError, setLocation, resetWeatherData } =
        useAstronomy();
    const [error, setError] = useState<string>();
    const [geolocationErrorCode, setGeolocationErrorCode] = useState<GeolocationErrorCode>();
    const [locationValue, setLocationValue] = useState<string>("");
    const [lastSearchedLocation, setLastSearchedLocation] = useState<string>("");
    const [locationDisplayName, setLocationDisplayName] = useState<string>("");

    useEffect(() => {
        if (weatherDataError && !error) setError(weatherDataError);
    }, [error, weatherDataError]);

    const resetSearch = () => {
        setLocationDisplayName("");
        setError(undefined);
        setGeolocationErrorCode(undefined);
    };

    const handleUseLocation = async () => {
        resetSearch();

        try {
            setLoadingState("loading-location");

            const { latitude, longitude } = await getCurrentPosition();
            const locationResponse = await getLocationName(latitude, longitude);

            if (locationResponse.error) {
                setError(locationResponse.error);
                resetWeatherData();
                return;
            }

            setLocationValue(locationResponse.name);
            setLocationDisplayName(locationResponse.displayName);
            setLastSearchedLocation(locationResponse.name.trim());
            setLocation(latitude, longitude);
        } catch (err: unknown) {
            const geolocationError = err as {
                code?: GeolocationErrorCode;
                message?: string;
            };

            setGeolocationErrorCode(geolocationError.code);
            setError(
                geolocationError.message ||
                    "Unable to retrieve your location. Please try again or search for a location instead.",
            );
            resetWeatherData();
            setLoadingState("idle");
        }
    };

    const handleLocationSearch = async () => {
        const normalisedLocation = locationValue?.replace(/[^\p{L}\p{N}\s'-]/gu, "").trim();
        if (!normalisedLocation || normalisedLocation === lastSearchedLocation) return;

        setLastSearchedLocation(normalisedLocation);
        resetSearch();

        setLoadingState("loading-location");
        const locationData = await getLatLng(normalisedLocation);

        if (locationData.error) {
            setError(locationData.error);
            resetWeatherData();
            return;
        }

        setLocationDisplayName(locationData.displayName);
        setLocation(locationData.latitude, locationData.longitude);
    };

    const canRetryGeolocation =
        geolocationErrorCode === "TIMEOUT" || geolocationErrorCode === "POSITION_UNAVAILABLE";

    return (
        <>
            <Tile title="Location">
                <div className="space-y-4">
                    <div className="rounded-lg bg-(--accent-primary)/10 border border-(--accent-primary)/20 p-3">
                        <p className="text-xs text-(--text-secondary)">
                            <span aria-hidden="true">📍</span> Your location is only used to find
                            the nearest location for your astronomy and weather data. Your browser
                            will ask for permission.
                        </p>
                    </div>

                    <button
                        onClick={handleUseLocation}
                        disabled={loadingState !== "idle"}
                        data-testid="use-location-button"
                        className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span aria-hidden="true">📍</span> Use My Location
                    </button>

                    <label
                        htmlFor="location-search"
                        className="text-xs font-semibold text-(--text-secondary) uppercase tracking-widest mb-3"
                    >
                        Search by location
                    </label>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLocationSearch();
                        }}
                        className="flex gap-3"
                    >
                        <input
                            id="location-search"
                            type="text"
                            placeholder="Search location..."
                            value={locationValue}
                            onChange={(e) => setLocationValue(e.target.value)}
                            disabled={loadingState !== "idle"}
                            data-testid="location-input"
                            className="flex-1 px-4 py-3 rounded-xl bg-background border border-(--card-border) text-foreground placeholder:(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            disabled={!locationValue?.trim() || loadingState !== "idle"}
                            data-testid="search-button"
                            className="px-5 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span aria-hidden="true">🔍</span>
                        </button>
                    </form>

                    <div role="status" aria-live="polite" aria-atomic="true">
                        {locationDisplayName && !error && (
                            <div className="mt-4 p-3 rounded-lg bg-(--accent-primary)/10 border border-(--accent-primary)/20">
                                <p className="text-xs font-semibold text-(--accent-primary) uppercase tracking-widest mb-1">
                                    Showing results for:
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                    {locationDisplayName}
                                </p>
                            </div>
                        )}
                    </div>
                    {error && (
                        <div className="mt-4 rounded-xl border border-(--accent-tertiary)/20 bg-(--accent-tertiary)/5 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--accent-tertiary)/10">
                                    <span className="text-sm" aria-hidden="true">
                                        ⚠️
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div role="alert">
                                        <p className="text-sm font-semibold text-(--accent-tertiary)">
                                            Unable to use your location
                                        </p>

                                        <p className="mt-1 text-sm leading-relaxed text-(--text-secondary)">
                                            {error}
                                        </p>
                                    </div>
                                    {geolocationErrorCode && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {canRetryGeolocation && (
                                                <button
                                                    type="button"
                                                    onClick={handleUseLocation}
                                                    disabled={loadingState !== "idle"}
                                                    data-testid="retry-location-button"
                                                    className="rounded-lg bg-(--accent-tertiary) px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Try again
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setError(undefined);
                                                    setGeolocationErrorCode(undefined);

                                                    document
                                                        .querySelector<HTMLInputElement>(
                                                            '[data-testid="location-input"]',
                                                        )
                                                        ?.focus();
                                                }}
                                                data-testid="search-location-button"
                                                className="rounded-lg border border-(--card-border) bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all cursor-pointer hover:border-(--accent-primary) hover:text-(--accent-primary)"
                                            >
                                                Search instead
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Tile>

            {loadingState !== "idle" && (
                <div className="flex flex-col items-center justify-center gap-3 mt-8 py-8">
                    <div aria-hidden="true" className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-(--accent-primary)/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-(--accent-primary) border-r-(--accent-secondary) animate-spin" />
                    </div>
                    <span className="text-sm font-medium text-(--text-secondary)">
                        {loadingState === "loading-location"
                            ? "Loading location..."
                            : "Loading weather..."}
                    </span>
                </div>
            )}
        </>
    );
};
