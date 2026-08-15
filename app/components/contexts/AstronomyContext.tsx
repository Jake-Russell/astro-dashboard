"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WeatherResponse } from "api/weather/types";
import { getWeatherData } from "../../utils/getWeatherData";
import type { GeoPosition } from "services/geolocationService";

export type LoadingState = "idle" | "loading-location" | "loading-weather";

export type AstronomyContextType = GeoPosition & {
    setLocation: (latitude: number, longitude: number) => void;
    weatherData?: WeatherResponse;
    weatherDataError?: string;
    setWeatherDataError: (error?: string) => void;
    loadingState: LoadingState;
    setLoadingState: (state: LoadingState) => void;
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
    const [weatherDataError, setWeatherDataError] = useState<string>();
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");

    useEffect(() => {
        if (latitude === 0 && longitude === 0) return;
        setLoadingState("loading-weather");
        setWeatherDataError(undefined);
        getWeatherData(latitude, longitude)
            .then((weatherData) => {
                if (weatherData.error) {
                    setWeatherDataError(weatherData.error);
                    setLoadingState("idle");
                } else {
                    setWeatherData(weatherData);
                    setLoadingState("idle");
                }
            })
            .catch((err) => {
                setWeatherDataError(err instanceof Error ? err.message : String(err));
                setLoadingState("idle");
            });
    }, [latitude, longitude]);

    const setLocation = (lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);
    };

    return (
        <AstronomyContext.Provider
            value={{
                latitude,
                longitude,
                setLocation,
                weatherData,
                weatherDataError,
                setWeatherDataError,
                loadingState,
                setLoadingState,
            }}
        >
            {children}
        </AstronomyContext.Provider>
    );
};
