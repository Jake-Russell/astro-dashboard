import type { HourData, WeatherResponse } from "api/weather/types";

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
        return {
            forecastStart: Math.floor(weatherData.current.dt / 3600) * 3600,
            forecastEnd: weatherData.current.sunrise,
            isActiveNight,
        };
    }

    return {
        forecastStart: todayData.sunset,
        forecastEnd: tomorrowData.sunrise,
        isActiveNight,
    };
};

export const getNightForecastHours = (
    hourlyForecast: HourData[],
    { forecastStart, forecastEnd }: NightForecastRange,
): HourData[] => {
    return hourlyForecast.filter((hour) => hour.dt >= forecastStart && hour.dt < forecastEnd);
};
