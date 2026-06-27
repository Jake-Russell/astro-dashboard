"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WeatherResponse } from "api/weather/types";
import { getWeatherData } from "../../utils/getWeatherData";
import { GeoPosition } from "services/geolocationService";

export type AstronomyContextType = GeoPosition & {
    setLatitude: (latitude: number) => void;
    setLongitude: (longitude: number) => void;
    weatherData?: WeatherResponse;
    weatherLoading: boolean;
    setWeatherLoading: (loading: boolean) => void;
};

const AstronomyContext = createContext<AstronomyContextType | undefined>(undefined);

export const useAstronomy = () => {
    const ctx = useContext(AstronomyContext);
    if (!ctx) throw new Error("useAstronomy must be used within an AstronomyProvider");
    return ctx;
};

export const AstronomyProvider = ({ children }: { children: ReactNode }) => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [weatherData, setWeatherData] = useState<WeatherResponse>();
    const [weatherLoading, setWeatherLoading] = useState(false);

    useEffect(() => {
        if (latitude === 0 && longitude === 0) return;
        setWeatherLoading(true);
        getWeatherData(latitude, longitude)
            .then((weatherData) => {
                setWeatherData(weatherData);
                setWeatherLoading(false);
            })
            .catch(() => setWeatherLoading(false));
    }, [latitude, longitude]);

    return (
        <AstronomyContext.Provider
            value={{
                latitude,
                longitude,
                setLatitude,
                setLongitude,
                weatherData,
                weatherLoading,
                setWeatherLoading,
            }}
        >
            {children}
        </AstronomyContext.Provider>
    );
};
