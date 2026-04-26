import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WeatherResponse } from "api/weather/route";
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

    it("should not fetch weather data when latitude/longitude are empty", () => {
        const spy = vi.spyOn(weatherApi, "getWeatherData");

        renderHook(() => useAstronomy(), { wrapper });
        expect(spy).not.toHaveBeenCalled();
    });

    it("should fetch weather data when latitude and longitude are set", async () => {
        vi.spyOn(weatherApi, "getWeatherData").mockResolvedValue(mockWeatherResponse);

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => {
            result.current.setLatitude(mockLat.toString());
            result.current.setLongitude(mockLng.toString());
        });

        await waitFor(() => expect(result.current.weatherLoading).toBe(false));

        expect(result.current.weatherData).toEqual(mockWeatherResponse);
    });

    it("should set loading state correctly during fetch", async () => {
        let resolveFn: (value: WeatherResponse) => void;

        const promise = new Promise<WeatherResponse>((resolve) => {
            resolveFn = resolve;
        });

        vi.spyOn(weatherApi, "getWeatherData").mockReturnValue(promise);

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => {
            result.current.setLatitude(mockLat.toString());
            result.current.setLongitude(mockLng.toString());
        });

        expect(result.current.weatherLoading).toBe(true);

        resolveFn!(mockWeatherResponse);

        await waitFor(() => expect(result.current.weatherLoading).toBe(false));
    });

    it("should handle fetch errors and reset loading", async () => {
        vi.spyOn(weatherApi, "getWeatherData").mockRejectedValue(new Error("fail"));

        const { result } = renderHook(() => useAstronomy(), { wrapper });

        act(() => {
            result.current.setLatitude(mockLat.toString());
            result.current.setLongitude(mockLng.toString());
        });

        expect(result.current.weatherLoading).toBe(true);
        expect(result.current.weatherData).toBeUndefined();
    });
});
