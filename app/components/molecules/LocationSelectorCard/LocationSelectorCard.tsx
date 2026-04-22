"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { Tile } from "atoms/Tile";
import { getCurrentPosition } from "services/geolocationService";
import { getLatLng, getLocationName } from "utils/getLocationData";
import { LocationSelectorCardProps } from "./types";

export const LocationSelectorCard: FunctionComponent<LocationSelectorCardProps> = ({
    isWeatherDataLoading,
    weatherDataError,
    setLatitude,
    setLongitude,
    setWeatherLoading,
}) => {
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const [location, setLocation] = useState<string>("");
    const [lastSearchedLocation, setLastSearchedLocation] = useState<string>("");
    const [locationDisplayName, setLocationDisplayName] = useState<string>("");

    useEffect(() => {
        if (isLoading !== isWeatherDataLoading) setIsLoading(isWeatherDataLoading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeatherDataLoading]);

    useEffect(() => {
        if (weatherDataError) setError(weatherDataError);
    }, [weatherDataError]);

    const resetSearch = () => {
        // TODO: Improve loading logic
        setWeatherLoading(true);
        setIsLoading(true);
        setLocationDisplayName("");
        setError(undefined);
    };

    const handleUseLocation = async () => {
        resetSearch();

        try {
            const { latitude, longitude } = await getCurrentPosition();

            setLatitude(latitude);
            setLongitude(longitude);

            const locationResponse = await getLocationName(latitude, longitude);

            if (locationResponse.error) {
                setIsLoading(false);
                setError(locationResponse.error);
                return;
            }

            setLocation(locationResponse.name);
            setLocationDisplayName(locationResponse.displayName);
            setLastSearchedLocation(locationResponse.name.trim());
            setIsLoading(false);
            setWeatherLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setIsLoading(false);
            setError(err.message || "Unable to retrieve your location.");
        }
    };

    const handleLocationSearch = async () => {
        const normalisedLocation = location?.trim();
        if (!normalisedLocation || normalisedLocation === lastSearchedLocation) return;

        resetSearch();

        const locationData = await getLatLng(normalisedLocation);
        if (locationData.error) {
            setIsLoading(false);
            setError(locationData.error);
            return;
        }

        setLatitude(locationData.lat);
        setLongitude(locationData.lon);
        setLocationDisplayName(locationData.displayName);
        setLastSearchedLocation(normalisedLocation);
    };

    return (
        <>
            <Tile title="Location" heading="h2">
                <div className="space-y-4">
                    <button
                        onClick={handleUseLocation}
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
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            data-testid="location-input"
                            className="flex-1 px-4 py-3 rounded-xl bg-background border border-(--card-border) text-foreground placeholder:(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:border-transparent transition-all duration-300"
                        />
                        <button
                            type="submit"
                            disabled={!location?.trim() || isLoading}
                            data-testid="search-button"
                            className="px-5 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🔍
                        </button>
                    </form>

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
                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-(--accent-tertiary)/10 border border-(--accent-tertiary)/20">
                            <p className="text-sm text-(--accent-tertiary) font-medium">
                                ⚠️ {error}
                            </p>
                        </div>
                    )}
                </div>
            </Tile>

            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-3 mt-8 py-8">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-(--accent-primary)/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-(--accent-primary) border-r-(--accent-secondary) animate-spin" />
                    </div>
                    <span className="text-sm font-medium text-(--text-secondary)">Loading...</span>
                </div>
            )}
        </>
    );
};
