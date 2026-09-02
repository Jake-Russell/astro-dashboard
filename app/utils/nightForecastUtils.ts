import type { HourData, WeatherResponse } from "api/weather/types";

const ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS = 90 * 60; // 90 minutes in seconds

export type NightForecastRange = {
    forecastStart: number;
    forecastEnd: number;
};

export type NightForecastWindow = NightForecastRange & {
    isActiveNight: boolean;
};

export const getNightForecastWindow = (weatherData: WeatherResponse): NightForecastWindow => {
    const todayData = weatherData.daily[0];
    const tomorrowData = weatherData.daily[1];
    const isActiveNight = weatherData.current.dt < weatherData.current.sunrise;

    if (isActiveNight) {
        // Mid-night: "now" is already fully dark, no twilight buffer needed
        // on the start side. Sunrise still needs its buffer trimmed off.
        const forecastStart = Math.floor(weatherData.current.dt / 3600) * 3600;
        const forecastEnd = weatherData.current.sunrise - ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS;

        return {
            forecastStart,
            forecastEnd,
            isActiveNight,
        };
    }

    return {
        forecastStart: todayData.sunset + ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS,
        forecastEnd: tomorrowData.sunrise - ASTRONOMICAL_TWILIGHT_OFFSET_SECONDS,
        isActiveNight,
    };
};

export const getNightForecastHours = (
    hourlyForecast: HourData[],
    { forecastStart, forecastEnd }: NightForecastRange,
): HourData[] => {
    if (forecastEnd <= forecastStart) return [];

    return hourlyForecast.filter((hour) => hour.dt >= forecastStart && hour.dt < forecastEnd);
};
