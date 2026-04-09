"use client";
import { useEffect, useState } from "react";
import { getLatLng, getLocationName } from "../utils/getLocationData";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

export const LocationTile = () => {
    const { setLatitude, setLongitude, weatherLoading, setWeatherData } = useAstronomy();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const [location, setLocation] = useState<string>();
    const [lastSearchedLocation, setLastSearchedLocation] = useState<string>();
    const [locationDisplayName, setLocationDisplayName] = useState<string>();

    useEffect(() => {
        if (isLoading !== weatherLoading) setIsLoading(weatherLoading);
    }, [weatherLoading]);

    const resetSearch = () => {
        setIsLoading(true);
        setWeatherData(undefined);
        setLocation(undefined);
        setLocationDisplayName(undefined);
        setError(undefined);
    };

    const handleUseLocation = () => {
        resetSearch();
        if (!navigator.geolocation) {
            setIsLoading(false);
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userLatitude = position.coords.latitude.toFixed(5);
                const userLongitude = position.coords.longitude.toFixed(5);

                setLatitude(userLatitude);
                setLongitude(userLongitude);

                const locationResponse = await getLocationName(userLatitude, userLongitude);
                if (locationResponse.error) {
                    setIsLoading(false);
                    setError(locationResponse.error);
                    return;
                }

                setLocation(locationResponse.name);
                setLocationDisplayName(locationResponse.displayName);
            },
            () => {
                // TODO: Add more specific error handling
                setIsLoading(false);
                setError("Unable to retrieve your location.");
            },
        );
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
                    className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 mb-4 cursor-pointer"
                    onClick={handleUseLocation}
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
                        className="flex-1 rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!location?.trim() || isLoading}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>
                {locationDisplayName && (
                    <div className="text-gray-500 text-xs mt-1">
                        Showing results for: {locationDisplayName}
                    </div>
                )}
                <div> </div>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
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
