import type { HourData, WeatherResponse } from "api/weather/types";

export type NightForecastRange = {
    forecastStart: number;
    nightEnd: number;
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
            nightEnd: weatherData.current.sunrise,
            isActiveNight,
        };
    }

    return {
        forecastStart: todayData.sunset,
        nightEnd: tomorrowData.sunrise,
        isActiveNight,
    };
};

export const getNightForecastHours = (
    hourlyForecast: HourData[],
    { nightEnd, forecastStart }: NightForecastRange,
): HourData[] => {
    return hourlyForecast.filter((hour) => hour.dt >= forecastStart && hour.dt < nightEnd);
};
