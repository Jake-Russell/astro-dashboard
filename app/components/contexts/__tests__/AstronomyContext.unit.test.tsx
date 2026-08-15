import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { WeatherResponse } from "api/weather/types";
import { mockWeatherResponse } from "../../../mocks/mockWeatherData";
import { mockLat, mockLng } from "../../../mocks/mockLocationData";
import * as weatherApi from "../../../utils/getWeatherData";
import { AstronomyProvider, useAstronomy } from "../AstronomyContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AstronomyProvider>{children}</AstronomyProvider>
);

describe("AstronomyContext", () => {
    it("should throw error when used outside provider", () => {
        expect(() => renderHook(() => useAstronomy())).toThrow(
            "useAstronomy must be used within an AstronomyProvider",
        );
    });

    it("should initialize with idle loading state", () => {
        const { result } = renderHook(() => useAstronomy(), { wrapper });
        expect(result.current.loadingState).toBe("idle");
        expect(result.current.weatherDataError).toBeUndefined();
    });

    it("should not fetch weather data when latitude/longitude are empty", () => {
        const spy = vi.spyOn(weatherApi, "getWeatherData");

        renderHook(() => useAstronomy(), { wrapper });
        expect(spy).not.toHaveBeenCalled();
    });

    it("should fetch weather data when latitude and longitude are set", async () => {
        vi.spyOn(weatherApi, "getWeatherData").mockResolvedValue(mockWeatherResponse);

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => result.current.setLocation(mockLat, mockLng));

        await waitFor(() => expect(result.current.loadingState).toBe("idle"));

        expect(result.current.weatherData).toEqual(mockWeatherResponse);
    });

    it("should set loading state to loading-weather during fetch", async () => {
        let resolveFn: (value: WeatherResponse) => void;

        const promise = new Promise<WeatherResponse>((resolve) => {
            resolveFn = resolve;
        });

        vi.spyOn(weatherApi, "getWeatherData").mockReturnValue(promise);

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => result.current.setLocation(mockLat, mockLng));

        expect(result.current.loadingState).toBe("loading-weather");

        resolveFn!(mockWeatherResponse);

        await waitFor(() => expect(result.current.loadingState).toBe("idle"));
    });

    it("should clear error before fetching weather", async () => {
        const getWeatherDataSpy = vi
            .spyOn(weatherApi, "getWeatherData")
            .mockResolvedValue(mockWeatherResponse);

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        // Set initial error
        act(() => result.current.setWeatherDataError("Previous error"));

        act(() => result.current.setLocation(mockLat, mockLng));

        await waitFor(() => expect(result.current.loadingState).toBe("idle"));

        expect(result.current.weatherDataError).toBeUndefined();
        expect(getWeatherDataSpy).toHaveBeenCalled();
    });

    it("should handle fetch errors and set error state", async () => {
        const errorMessage = "Network error";
        vi.spyOn(weatherApi, "getWeatherData").mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => result.current.setLocation(mockLat, mockLng));

        expect(result.current.loadingState).toBe("loading-weather");

        await waitFor(() => expect(result.current.loadingState).toBe("idle"));
        expect(result.current.setWeatherDataError).toBe(errorMessage);
        expect(result.current.weatherData).toBeUndefined();
    });

    it("should handle API error responses", async () => {
        const errorResponse = { ...mockWeatherResponse, error: "Weather API error" };
        vi.spyOn(weatherApi, "getWeatherData").mockResolvedValue(errorResponse);

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => result.current.setLocation(mockLat, mockLng));

        await waitFor(() => expect(result.current.loadingState).toBe("idle"));
        expect(result.current.setWeatherDataError).toBe("Weather API error");
    });

    it("should allow manual loading state management", () => {
        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => result.current.setLoadingState("loading-location"));

        expect(result.current.loadingState).toBe("loading-location");

        act(() => result.current.setLoadingState("idle"));

        expect(result.current.loadingState).toBe("idle");
    });
});
