import type { HourData, WeatherResponse } from "api/weather/types";

export type NightForecastRange = {
    nightStart: number;
    nightEnd: number;
    forecastStart: number;
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
            nightStart: weatherData.current.sunset,
            nightEnd: weatherData.current.sunrise,
            forecastStart: Math.floor(weatherData.current.dt / 3600) * 3600,
            isActiveNight,
        };
    }

    return {
        nightStart: todayData.sunset,
        nightEnd: tomorrowData.sunrise,
        forecastStart: todayData.sunset,
        isActiveNight,
    };
};

export const getNightForecastHours = (
    hourlyForecast: HourData[],
    { nightStart, nightEnd, forecastStart }: NightForecastRange,
): HourData[] => {
    return hourlyForecast.filter(
        (hour) => hour.dt > nightStart && hour.dt >= forecastStart && hour.dt < nightEnd,
    );
};
