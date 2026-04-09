"use client";
import { useState } from "react";
import { getLatLng, getLocationName } from "../utils/getLocationData";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const LocationTile = () => {
    const { setLatitude, setLongitude, weatherData } = useAstronomy();
    const [error, setError] = useState<string | null>(null);

    const [location, setLocation] = useState("");
    const [locationDisplayName, setLocationDisplayName] = useState("");

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setLatitude(position.coords.latitude.toFixed(5));
                setLongitude(position.coords.longitude.toFixed(5));

                const location = await getLocationName(
                    position.coords.latitude.toString(),
                    position.coords.longitude.toString(),
                );
                setLocation(location.name);
                setLocationDisplayName(location.displayName);

                setError(null);
            },
            () => {
                // TODO: Add more specific error handling
                setError("Unable to retrieve your location.");
            },
        );
    };

    const handleLocationSearch = async () => {
        const locationData = await getLatLng(location);
        console.log(`Location data for ${location}:`, locationData);
        setLatitude(locationData.lat);
        setLongitude(locationData.lon);

        setLocationDisplayName(locationData.displayName);
    };

    return (
        <Tile title="Location">
            <button
                className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 mb-4 cursor-pointer"
                onClick={handleUseLocation}
            >
                Use My Location
            </button>
            <div className="flex flex-col gap-2">
                <p>Or alternatively, search for a location:</p>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 mb-4 cursor-pointer"
                    onClick={handleLocationSearch}
                >
                    Search
                </button>
                <div className="text-gray-500 text-xs mt-1 select-none">
                    Showing results for:
                    {weatherData ? (
                        <p>{locationDisplayName}</p>
                    ) : (
                        <span className="italic"> (not set)</span>
                    )}
                </div>
                <div> </div>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            </div>
        </Tile>
    );
};

export default LocationTile;
