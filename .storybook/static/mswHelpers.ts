import { delay, http, HttpResponse } from "msw";
import { WeatherResponse } from "api/weather/types";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { mockWeatherResponse } from "mocks/mockWeatherData";
import type { LocationReverseResponse, LocationSearchResponse } from "api/location/types";

export const getMswLocationReverseLoader = (status: number = 200) => {
    return http.get("/api/location/reverse", async () => {
        delay(200);

        const response: LocationReverseResponse = {
            name: "Test Location",
            displayName: "Test Location, Test Country",
            ...(status !== 200 && { error: "Failed to fetch location data" }),
        };

        return HttpResponse.json(response, { status });
    });
};

export const getMswLocationSearchLoader = (status: number = 200) => {
    return http.get("/api/location/search", async () => {
        delay(200);

        const response: LocationSearchResponse = {
            latitude: mockLat,
            longitude: mockLng,
            displayName: "Test Location, Test Country",
            ...(status !== 200 && { error: "Failed to fetch location data" }),
        };

        return HttpResponse.json(response, { status });
    });
};

export const getMswWeatherLoader = (status: number = 200) => {
    return http.get("/api/weather", async () => {
        delay(200);

        const response: WeatherResponse = {
            ...mockWeatherResponse,
            ...(status !== 200 && { error: "Failed to fetch weather data" }),
        };

        return HttpResponse.json(response, { status });
    });
};
