"use client";
import { type FunctionComponent, useState, useRef } from "react";
import { Tile } from "atoms";
import { useAstronomy } from "contexts/AstronomyContext";
import { type GeolocationErrorCode, getCurrentPosition } from "services/geolocationService";
import { getLatLng, getLocationName } from "utils/getLocationData";
import { getActiveError } from "./utils";

export const LocationSelectorCard: FunctionComponent = () => {
    const {
        loadingState,
        weatherDataError,
        setLoadingState,
        setLocation,
        resetWeatherData,
        retryWeather,
    } = useAstronomy();
    const [error, setError] = useState<string>();
    const [geolocationErrorCode, setGeolocationErrorCode] = useState<GeolocationErrorCode>();

    const [locationValue, setLocationValue] = useState<string>("");
    const [lastSearchedLocation, setLastSearchedLocation] = useState<string>("");
    const [locationDisplayName, setLocationDisplayName] = useState<string>("");

    const locationSearchInputRef = useRef<HTMLInputElement>(null);

    const isLoading = loadingState !== "idle";
    const isLoadingLocation = loadingState === "loading-location";

    const resetSearch = () => {
        setLocationDisplayName("");
        setError(undefined);
        setGeolocationErrorCode(undefined);
    };

    const handleUseLocation = async () => {
        resetSearch();
        setLoadingState("loading-location");

        try {
            const { latitude, longitude } = await getCurrentPosition();

            setLocationDisplayName("Finding your location...");

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
        }
    };

    const handleLocationSearch = async () => {
        const normalisedLocation = locationValue.replace(/[^\p{L}\p{N}\s'-]/gu, "").trim();
        if (!normalisedLocation || normalisedLocation === lastSearchedLocation) return;

        setLastSearchedLocation(normalisedLocation);
        resetSearch();
        setLoadingState("loading-location");

        try {
            const locationData = await getLatLng(normalisedLocation);

            if (locationData.error) {
                setError(locationData.error);
                resetWeatherData();
                return;
            }

            setLocationDisplayName(locationData.displayName);
            setLocation(locationData.latitude, locationData.longitude);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            resetWeatherData();
        }
    };

    const handleRetryWeather = () => {
        setError(undefined);
        retryWeather();
    };

    const handleChangeLocation = () => {
        resetWeatherData();
        resetSearch();
        setLocationValue("");
        setLastSearchedLocation("");
        locationSearchInputRef.current?.focus();
    };

    const handleSearchInsteadClick = () => {
        resetSearch();
        locationSearchInputRef.current?.focus();
    };

    const canRetryGeolocation =
        geolocationErrorCode === "TIMEOUT" || geolocationErrorCode === "POSITION_UNAVAILABLE";

    const activeError = getActiveError(error, weatherDataError);

    return (
        <Tile title="Location" interactive={!isLoading}>
            <div className="space-y-4">
                <div className="rounded-lg bg-(--accent-primary)/10 border border-(--accent-primary)/20 p-3">
                    <p className="text-xs text-(--text-secondary)">
                        <span aria-hidden="true">📍</span> Your location is only used to find the
                        nearest location for your astronomy and weather data. Your browser will ask
                        for permission.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={isLoading}
                    data-testid="use-location-button"
                    className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-shadow duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span aria-hidden="true">📍</span>{" "}
                    {isLoadingLocation ? "Finding your location..." : "Use My Location"}
                </button>

                <label
                    htmlFor="location-search"
                    className="text-xs font-semibold text-(--text-secondary) uppercase tracking-widest mb-3"
                >
                    Search by location
                </label>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleLocationSearch();
                    }}
                    className="flex gap-3"
                >
                    <input
                        id="location-search"
                        ref={locationSearchInputRef}
                        type="text"
                        placeholder="Search location..."
                        value={locationValue}
                        onChange={(event) => setLocationValue(event.target.value)}
                        disabled={isLoading}
                        data-testid="location-input"
                        className="flex-1 px-4 py-3 rounded-xl bg-background border border-(--card-border) text-foreground placeholder:(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        disabled={!locationValue.trim() || isLoading}
                        data-testid="search-button"
                        className="px-5 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-shadow duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span aria-hidden="true">🔍</span>
                    </button>
                </form>

                <div role="status" aria-live="polite" aria-atomic="true">
                    {locationDisplayName && !error && !weatherDataError && (
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

                {activeError && (
                    <div
                        className="mt-4 rounded-xl border border-(--accent-tertiary)/20 bg-(--accent-tertiary)/5 p-4"
                        data-testid="location-selector-error"
                        role="alert"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--accent-tertiary)/10">
                                <span className="text-sm" aria-hidden="true">
                                    ⚠️
                                </span>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-(--accent-tertiary)">
                                    {activeError.title}
                                </p>

                                <p className="mt-1 text-sm leading-relaxed text-(--text-secondary)">
                                    {activeError.message}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {activeError.type === "location" && geolocationErrorCode && (
                                        <>
                                            {canRetryGeolocation && (
                                                <button
                                                    type="button"
                                                    onClick={handleUseLocation}
                                                    disabled={isLoading}
                                                    data-testid="retry-location-button"
                                                    className="rounded-lg bg-(--accent-tertiary) px-4 py-2 text-sm font-semibold text-white transition-shadow hover:opacity-90 hover:shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Try again
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleSearchInsteadClick}
                                                data-testid="search-location-button"
                                                className="rounded-lg border border-(--card-border) bg-background px-4 py-2 text-sm font-semibold text-foreground transition-shadow cursor-pointer hover:border-(--accent-primary) hover:text-(--accent-primary)"
                                            >
                                                Search instead
                                            </button>
                                        </>
                                    )}

                                    {activeError.type === "weather" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleRetryWeather}
                                                disabled={isLoading}
                                                data-testid="retry-weather-button"
                                                className="rounded-lg bg-(--accent-tertiary) px-4 py-2 text-sm font-semibold text-white transition-shadow hover:opacity-90 hover:shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Try again
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleChangeLocation}
                                                disabled={isLoading}
                                                data-testid="change-location-button"
                                                className="rounded-lg border border-(--card-border) bg-background px-4 py-2 text-sm font-semibold text-foreground transition-shadow cursor-pointer hover:border-(--accent-primary) hover:text-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Change location
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Tile>
    );
};
