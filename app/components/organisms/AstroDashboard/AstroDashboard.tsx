"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { WeatherResponse } from "api/weather/types";
import { StarsBackground, ThemeToggle, Tile } from "atoms";
import { useAstronomy } from "contexts/AstronomyContext";
import {
    AstroDashboardSkeleton,
    AstroScoreCard,
    LocationSelector,
    MoonPhaseCard,
    NightWeatherForecastCard,
    SunCycleCard,
} from "molecules";
import type {
    AstroScoreCardProps,
    MoonPhaseCardProps,
    NightWeatherForecastCardProps,
    SunCycleCardProps,
} from "molecules";
import type { GeoPosition } from "services/geolocationService";
import { getNightForecastHours, getNightForecastWindow } from "utils/nightForecastUtils";

const getBaseProps = (latitude: number, longitude: number): GeoPosition => {
    return { latitude, longitude };
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
    };
};

const getSunData = (
    weatherData: WeatherResponse,
): Omit<SunCycleCardProps, "latitude" | "longitude"> => {
    const todayData = weatherData.daily[0];
    const tomorrowData = weatherData.daily[1];

    return {
        sunrise: todayData.sunrise,
        sunset: todayData.sunset,
        tomorrowSunrise: tomorrowData.sunrise,
    };
};

const getWeatherForecastData = (
    weatherData: WeatherResponse,
): Omit<NightWeatherForecastCardProps, "latitude" | "longitude"> => {
    const { forecastStart, forecastEnd } = getNightForecastWindow(weatherData);

    const nightHours = getNightForecastHours(weatherData.hourly, {
        forecastStart,
        forecastEnd,
    });

    return { nightHours };
};

const getScoreCardData = (
    weatherData: WeatherResponse,
): Omit<AstroScoreCardProps, "latitude" | "longitude"> => {
    const todayData = weatherData.daily[0];
    const tomorrowData = weatherData.daily[1];
    const { forecastStart, forecastEnd } = getNightForecastWindow(weatherData);

    const nightHours = getNightForecastHours(weatherData.hourly, {
        forecastStart,
        forecastEnd,
    });

    return {
        // During the active night, the forecast API has advanced to today's
        // lunar data and does not include yesterday's moonrise. Lunar scoring
        // is therefore approximate until sunrise.
        moonriseToday: todayData.moonrise,
        moonsetToday: todayData.moonset,
        moonsetTomorrow: tomorrowData.moonset,
        moonPhase: todayData.moon_phase,
        forecastStart,
        forecastEnd,
        nightHours,
    };
};

export const AstroDashboard = () => {
    const { latitude, longitude, weatherData, weatherDataError, loadingState } = useAstronomy();
    const [astroAnnouncement, setAstroAnnouncement] = useState("");

    const handleAstroAnnouncement = useCallback((announcement: string) => {
        setAstroAnnouncement(announcement);
    }, []);

    useEffect(() => {
        if (loadingState !== "idle") setAstroAnnouncement("");
    }, [loadingState]);

    const baseProps = useMemo(() => getBaseProps(latitude, longitude), [latitude, longitude]);
    const hasWeatherData = Boolean(weatherData && !weatherData.error);
    const isLoading = loadingState !== "idle";

    const moonPhaseData = useMemo(() => {
        if (!weatherData || weatherData.error) return null;
        return { ...baseProps, ...getMoonData(weatherData) };
    }, [weatherData, baseProps]);

    const sunCycleData = useMemo(() => {
        if (!weatherData || weatherData.error) return null;
        return { ...baseProps, ...getSunData(weatherData) };
    }, [weatherData, baseProps]);

    const weatherForecastData = useMemo(() => {
        if (!weatherData || weatherData.error) return null;
        return { ...baseProps, ...getWeatherForecastData(weatherData) };
    }, [weatherData, baseProps]);

    const astroScoreCardData = useMemo(() => {
        if (!weatherData || weatherData.error) return null;
        return { ...baseProps, ...getScoreCardData(weatherData) };
    }, [weatherData, baseProps]);

    return (
        <main className="min-h-screen bg-background relative overflow-x-hidden">
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {loadingState === "loading-location" && "Finding your location"}
                {loadingState === "loading-weather" && "Loading weather and astronomy data"}
            </div>

            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {astroAnnouncement}
            </div>

            {/* Stars */}
            <div className="light:none dark:block fixed inset-0 z-0 pointer-events-none">
                <StarsBackground />
            </div>

            <div className="relative overflow-hidden pt-12 pb-8 md:pt-20 md:pb-12">
                {/* Animated gradient background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 -left-1/2 w-full h-96 bg-linear-to-br from-(--accent-primary)/10 via-(--accent-secondary)/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-96 bg-linear-to-tl from-(--accent-tertiary)/10 via-(--accent-secondary)/5 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
                <div className="flex flex-col gap-6">
                    <LocationSelector />

                    {!isLoading && !hasWeatherData && !weatherDataError && (
                        <Tile interactive={false}>
                            <div aria-labelledby="dashboard-empty-title" className="text-center">
                                <div className="text-5xl mb-5" aria-hidden="true">
                                    🌌
                                </div>

                                <h2
                                    id="dashboard-empty-title"
                                    className="text-2xl font-bold bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) bg-clip-text text-transparent"
                                >
                                    Your night sky awaits
                                </h2>

                                <p className="mt-3 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-(--text-secondary)">
                                    Select a location above to see tonight&apos;s moon, sun, weather
                                    and stargazing conditions.
                                </p>
                            </div>
                        </Tile>
                    )}

                    {isLoading && <AstroDashboardSkeleton />}

                    {/* Loaded dashboard */}
                    {!isLoading && hasWeatherData && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {moonPhaseData && <MoonPhaseCard {...moonPhaseData} />}
                                {sunCycleData && <SunCycleCard {...sunCycleData} />}
                            </div>

                            {weatherForecastData && (
                                <NightWeatherForecastCard {...weatherForecastData} />
                            )}

                            {astroScoreCardData && (
                                <AstroScoreCard
                                    {...astroScoreCardData}
                                    onAnnouncement={handleAstroAnnouncement}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};
