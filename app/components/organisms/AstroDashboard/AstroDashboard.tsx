"use client";
import { useMemo } from "react";
import { WeatherResponse } from "api/weather/route";
import { StarsBackground } from "atoms/StarsBackground";
import { ThemeToggle } from "atoms/ThemeToggle";
import { useAstronomy } from "contexts/AstronomyContext";
import { AstroScoreCard } from "molecules/AstroScoreCard";
import { LocationSelector } from "molecules/LocationSelectorCard";
import { MoonPhaseCard, MoonPhaseCardProps } from "molecules/MoonPhaseCard";
import {
    NightWeatherForecastCard,
    NightWeatherForecastCardProps,
} from "molecules/NightWeatherForecastCard";
import { SunCycleCard, SunCycleCardProps } from "molecules/SunCycleCard";
import { BaseCardProps } from "molecules/types";

const getBaseProps = (latitude: string, longitude: string): BaseCardProps => {
    return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
    };
};

const getMoonData = (
    weatherData: WeatherResponse,
): Omit<MoonPhaseCardProps, "latitude" | "longitude"> => {
    const todayData = weatherData.daily[0];
    const tomorrowData = weatherData.daily[1];

    return {
        moonriseToday: todayData.moonrise,
        moonsetToday: todayData.moonset,
        moonsetTomorrow: tomorrowData.moonset,
        moonPhase: todayData.moon_phase,
        error: weatherData.error,
    };
};

const getSunData = (
    weatherData: WeatherResponse,
): Omit<SunCycleCardProps, "latitude" | "longitude"> => {
    const todayData = weatherData.daily[0];

    return {
        sunrise: todayData.sunrise,
        sunset: todayData.sunset,
        error: weatherData.error,
    };
};

const getWeatherForecastData = (
    weatherData: WeatherResponse,
): Omit<NightWeatherForecastCardProps, "latitude" | "longitude"> => {
    const todayData = weatherData.daily[0];
    const tomorrowData = weatherData.daily[1];

    return {
        hourlyForecast: weatherData.hourly,
        sunsetToday: todayData.sunset,
        sunriseTomorrow: tomorrowData.sunrise,
        error: weatherData.error,
    };
};

export const AstroDashboard = () => {
    const {
        latitude,
        longitude,
        weatherData,
        weatherLoading,
        setLatitude,
        setLongitude,
        resetWeatherData,
    } = useAstronomy();

    const baseProps = useMemo(() => getBaseProps(latitude, longitude), [latitude, longitude]);

    const moonPhaseData = useMemo(() => {
        if (!weatherData) return null;
        return { ...baseProps, ...getMoonData(weatherData) };
    }, [weatherData, baseProps]);

    const sunCycleData = useMemo(() => {
        if (!weatherData) return null;
        return { ...baseProps, ...getSunData(weatherData) };
    }, [weatherData, baseProps]);

    const weatherForecastData = useMemo(() => {
        if (!weatherData) return null;
        return { ...baseProps, ...getWeatherForecastData(weatherData) };
    }, [weatherData, baseProps]);

    return (
        <main className="min-h-screen bg-background relative overflow-x-hidden">
            {/* Stars */}
            <div className="light:none dark:block absolute inset-0 z-0 pointer-events-none">
                <div className="relative w-full h-full min-h-screen">
                    <StarsBackground />
                </div>
            </div>

            <div className="relative overflow-hidden pt-12 pb-8 md:pt-20 md:pb-12">
                {/* Animated gradient background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 -left-1/2 w-full h-96 bg-linear-to-br from-(--accent-primary)/10 via-(--accent-secondary)/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-96 bg-linear-to-tl from-(--accent-tertiary)/10 via-(--accent-secondary)/5 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with title and toggle */}
                    <div className="relative mb-8">
                        <div className="text-center space-y-4 flex flex-col items-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-[calc(100vw-100px)]">
                                <span className="bg-linear-to-r from-(--accent-primary) via-(--accent-secondary) to-(--accent-tertiary) bg-clip-text text-transparent">
                                    Astro Dashboard
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-(--text-secondary) max-w-2xl mx-auto">
                                Explore celestial wonders and weather patterns from your location
                            </p>
                        </div>

                        <div className="absolute top-0 right-0">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
                <div className="flex flex-col gap-6">
                    <LocationSelector
                        isWeatherDataLoading={weatherLoading}
                        weatherDataError={weatherData?.error}
                        setLatitude={setLatitude}
                        setLongitude={setLongitude}
                        resetWeatherData={resetWeatherData}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {moonPhaseData && <MoonPhaseCard {...moonPhaseData} />}
                        {sunCycleData && <SunCycleCard {...sunCycleData} />}
                    </div>
                    {weatherForecastData && <NightWeatherForecastCard {...weatherForecastData} />}
                    {weatherData && (
                        // TODO: Improve this when props are confirmed
                        <AstroScoreCard
                            latitude={baseProps.latitude}
                            longitude={baseProps.longitude}
                            weatherData={weatherData}
                            error={baseProps.error}
                        />
                    )}
                </div>
            </div>
        </main>
    );
};
