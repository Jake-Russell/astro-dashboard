"use client";
import { AstroScoreCard } from "molecules/AstroScoreCard";
import { LocationSelector } from "molecules/LocationSelectorCard";
import { MoonPhaseCard, MoonPhaseCardProps } from "molecules/MoonPhaseCard";
import {
    NightWeatherForecastCard,
    NightWeatherForecastCardProps,
} from "molecules/NightWeatherForecastCard";
import { SunCycleCard, SunCycleCardProps } from "molecules/SunCycleCard";
import { useAstronomy } from "contexts/AstronomyContext";
import { WeatherResponse } from "api/weather/route";
import { useMemo } from "react";
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
    const { latitude, longitude, weatherData } = useAstronomy();

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
        <main className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">Astro Dashboard</h1>

            <div className="flex flex-col gap-4">
                <LocationSelector />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moonPhaseData && <MoonPhaseCard {...moonPhaseData} />}
                    {sunCycleData && <SunCycleCard {...sunCycleData} />}
                </div>

                {weatherForecastData && <NightWeatherForecastCard {...weatherForecastData} />}
                {weatherData && (
                    // TODO: Improve this when props are confirmed
                    <AstroScoreCard
                        {...{
                            latitude: baseProps.latitude,
                            longitude: baseProps.longitude,
                            error: baseProps.error,
                            weatherData: weatherData,
                        }}
                    />
                )}
            </div>
        </main>
    );
};
