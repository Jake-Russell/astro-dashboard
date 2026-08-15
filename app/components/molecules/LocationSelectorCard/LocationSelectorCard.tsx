"use client";
import { type FunctionComponent, useState } from "react";
import { Tile } from "atoms";
import { useAstronomy } from "contexts/AstronomyContext";
import { getCurrentPosition } from "services/geolocationService";
import { getLatLng, getLocationName } from "utils/getLocationData";

export const LocationSelectorCard: FunctionComponent = () => {
    const { loadingState, setLoadingState, error: weatherError, setLocation } = useAstronomy();
    const [error, setLocalError] = useState<string>();

    const [locationValue, setLocationValue] = useState<string>("");
    const [lastSearchedLocation, setLastSearchedLocation] = useState<string>("");
    const [locationDisplayName, setLocationDisplayName] = useState<string>("");

    const resetSearch = () => {
        setLoadingState("loading-location");
        setLocationDisplayName("");
        setLocalError(undefined);
    };

    const handleUseLocation = async () => {
        resetSearch();

        try {
            const { latitude, longitude } = await getCurrentPosition();
            const locationResponse = await getLocationName(latitude, longitude);

            if (locationResponse.error) {
                setLocalError(locationResponse.error);
                setLoadingState("idle");
                return;
            }

            setLocationValue(locationResponse.name);
            setLocationDisplayName(locationResponse.displayName);
            setLastSearchedLocation(locationResponse.name.trim());
            setLocation(latitude, longitude);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setLocalError(err.message || "Unable to retrieve your location.");
            setLoadingState("idle");
        }
    };

    const handleLocationSearch = async () => {
        const normalisedLocation = locationValue?.trim();
        if (!normalisedLocation || normalisedLocation === lastSearchedLocation) return;

        resetSearch();

        const locationData = await getLatLng(normalisedLocation);
        if (locationData.error) {
            setLocalError(locationData.error);
            setLoadingState("idle");
            return;
        }

        setLocationDisplayName(locationData.displayName);
        setLastSearchedLocation(normalisedLocation);
        setLocation(locationData.latitude, locationData.longitude);
    };

    return (
        <>
            <Tile title="Location" heading="h2">
                <div className="space-y-4">
                    <button
                        onClick={handleUseLocation}
                        disabled={loadingState !== "idle"}
                        data-testid="use-location-button"
                        className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📍 Use My Location
                    </button>

                    <div className="text-xs font-semibold text-(--text-secondary) uppercase tracking-widest mb-3">
                        Or search by location
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLocationSearch();
                        }}
                        className="flex gap-3"
                    >
                        <input
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
                            disabled={!locationValue?.trim() || loadingState !== "idle"}
                            data-testid="search-button"
                            className="px-5 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🔍
                        </button>
                    </form>

                    {locationDisplayName && !error && !weatherError && (
                        <div className="mt-4 p-3 rounded-lg bg-(--accent-primary)/10 border border-(--accent-primary)/20">
                            <p className="text-xs font-semibold text-(--accent-primary) uppercase tracking-widest mb-1">
                                Showing results for:
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                {locationDisplayName}
                            </p>
                        </div>
                    )}
                    {(error || weatherError) && (
                        <div className="mt-4 p-3 rounded-lg bg-(--accent-tertiary)/10 border border-(--accent-tertiary)/20">
                            <p className="text-sm text-(--accent-tertiary) font-medium">
                                ⚠️ {error || weatherError}
                            </p>
                        </div>
                    )}
                </div>
            </Tile>

            {loadingState !== "idle" && (
                <div className="flex flex-col items-center justify-center gap-3 mt-8 py-8">
                    <div className="relative w-12 h-12">
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
