"use client";
import { useState } from "react";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const LocationTile = () => {
    const { latitude, longitude, setLatitude, setLongitude } = useAstronomy();
    const [error, setError] = useState<string | null>(null);
    const [dateTime, setDateTime] = useState<string>("");

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toFixed(5));
                setLongitude(position.coords.longitude.toFixed(5));
                setDateTime(new Date().toLocaleString());
                setError(null);
            },
            () => {
                setError("Unable to retrieve your location.");
            },
        );
    };

    return (
        <Tile title="Location">
            <button
                className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 mb-4"
                onClick={handleUseLocation}
            >
                Use My Location
            </button>
            <div className="flex flex-col gap-2">
                <input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-gray-500 text-xs mt-1 select-none">
                    Date/Time: {dateTime || <span className="italic">(not set)</span>}
                </div>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            </div>
        </Tile>
    );
};

export default LocationTile;
