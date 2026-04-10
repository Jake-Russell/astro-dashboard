"use client";
import { useEffect, useState } from "react";
import { Tile } from "atoms/Tile";
import { getCurrentPosition } from "services/geolocationService";
import { getLatLng, getLocationName } from "utils/getLocationData";
import { useAstronomy } from "../../AstronomyContext";

export const LocationSelector = () => {
    const { setLatitude, setLongitude, weatherLoading, weatherData, setWeatherData } =
        useAstronomy();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const [location, setLocation] = useState<string>("");
    const [lastSearchedLocation, setLastSearchedLocation] = useState<string>("");
    const [locationDisplayName, setLocationDisplayName] = useState<string>("");

    useEffect(() => {
        if (isLoading !== weatherLoading) setIsLoading(weatherLoading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherLoading]);

    useEffect(() => {
        if (weatherData?.error) setError(weatherData.error);
    }, [weatherData]);

    const resetSearch = () => {
        setIsLoading(true);
        setWeatherData(undefined);
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
            <Tile title="Location">
                <button
                    disabled={isLoading}
                    onClick={handleUseLocation}
                    data-testid="use-location-button"
                    className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 mb-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
                >
                    Use My Location
                </button>

                <p>Or alternatively, search for a location:</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLocationSearch();
                    }}
                    className="flex gap-2 mt-2 mb-4"
                >
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        data-testid="location-input"
                        className="flex-1 rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!location?.trim() || isLoading}
                        data-testid="search-button"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>

                {locationDisplayName && !error && (
                    <div className="text-gray-500 text-xs mt-1">
                        Showing results for: {locationDisplayName}
                    </div>
                )}
                {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </Tile>

            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-600 mt-8">
                    <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading...</span>
                </div>
            )}
        </>
    );
};
