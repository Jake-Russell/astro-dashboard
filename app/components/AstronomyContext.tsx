"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { WeatherResponse } from "../api/weather/route";
import { getWeatherData } from "../utils/getWeatherData";

export type AstronomyContextType = {
    latitude: string;
    longitude: string;
    setLatitude: (lat: string) => void;
    setLongitude: (lng: string) => void;
    weatherData?: WeatherResponse;
    weatherLoading: boolean;
};

const AstronomyContext = createContext<AstronomyContextType | undefined>(undefined);

export const useAstronomy = () => {
    const ctx = useContext(AstronomyContext);
    if (!ctx) throw new Error("useAstronomy must be used within an AstronomyProvider");
    return ctx;
};

export const AstronomyProvider = ({ children }: { children: React.ReactNode }) => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [weatherData, setWeatherData] = useState<WeatherResponse>();
    const [weatherLoading, setWeatherLoading] = useState(false);

    useEffect(() => {
        if (!latitude || !longitude) return;
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
            }}
        >
            {children}
        </AstronomyContext.Provider>
    );
};
