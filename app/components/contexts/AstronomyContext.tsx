"use client";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
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
    retryWeather: () => void;
    resetWeatherData: () => void;
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

    const fetchWeather = async (lat: number, lng: number) => {
        setLoadingState("loading-weather");
        setWeatherDataError(undefined);

        try {
            const weatherResponse = await getWeatherData(lat, lng);

            if (weatherResponse.error) {
                setWeatherDataError(weatherResponse.error);
                setLoadingState("idle");
                return;
            }

            setWeatherData(weatherResponse);
            setLoadingState("idle");
        } catch (err: unknown) {
            setWeatherDataError(err instanceof Error ? err.message : String(err));
            setLoadingState("idle");
        }
    };

    useEffect(() => {
        if (latitude === 0 && longitude === 0) return;

        fetchWeather(latitude, longitude);
    }, [latitude, longitude]);

    const setLocation = useCallback(
        (lat: number, lng: number) => {
            const locationIsSame = lat === latitude && lng === longitude;
            if (locationIsSame) {
                setLoadingState("idle");
                return;
            }

            setLatitude(lat);
            setLongitude(lng);
        },
        [latitude, longitude],
    );

    const retryWeather = useCallback(() => {
        if (latitude === 0 && longitude === 0) return;

        fetchWeather(latitude, longitude);
    }, [latitude, longitude]);

    const resetWeatherData = () => {
        setLatitude(0);
        setLongitude(0);
        setWeatherData(undefined);
        setWeatherDataError(undefined);
        setLoadingState("idle");
    };

    const value = useMemo(
        () => ({
            latitude,
            longitude,
            setLocation,
            weatherData,
            weatherDataError,
            setWeatherDataError,
            loadingState,
            setLoadingState,
            retryWeather,
            resetWeatherData,
        }),
        [
            latitude,
            longitude,
            setLocation,
            weatherData,
            weatherDataError,
            loadingState,
            retryWeather,
        ],
    );

    return <AstronomyContext.Provider value={value}>{children}</AstronomyContext.Provider>;
};
