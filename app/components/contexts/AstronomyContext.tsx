"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WeatherResponse } from "api/weather/types";
import { getWeatherData } from "../../utils/getWeatherData";
import type { GeoPosition } from "services/geolocationService";

export type LoadingState = "idle" | "loading-location" | "loading-weather";

export type AstronomyContextType = GeoPosition & {
    setLatitude: (latitude: number) => void;
    setLongitude: (longitude: number) => void;
    weatherData?: WeatherResponse;
    loadingState: LoadingState;
    setLoadingState: (state: LoadingState) => void;
    error?: string;
    setError: (error?: string) => void;
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
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (latitude === 0 && longitude === 0) return;
        setLoadingState("loading-weather");
        setError(undefined);
        getWeatherData(latitude, longitude)
            .then((weatherData) => {
                if (weatherData.error) {
                    setError(weatherData.error);
                    setLoadingState("idle");
                } else {
                    setWeatherData(weatherData);
                    setLoadingState("idle");
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : String(err));
                setLoadingState("idle");
            });
    }, [latitude, longitude]);

    return (
        <AstronomyContext.Provider
            value={{
                latitude,
                longitude,
                setLatitude,
                setLongitude,
                weatherData,
                loadingState,
                setLoadingState,
                error,
                setError,
            }}
        >
            {children}
        </AstronomyContext.Provider>
    );
};
