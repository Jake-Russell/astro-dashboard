import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import type { WeatherResponse } from "api/weather/types";
import { AstronomyProvider } from "contexts/AstronomyContext";
import { mockWeatherResponse, mockDayData, mockTimestamps } from "mocks/mockWeatherData";
import {
    getMswLocationReverseLoader,
    getMswLocationSearchLoader,
    getMswWeatherLoader,
} from "storybook/mswHelpers";
import { AstroDashboard } from "./AstroDashboard";

const meta = {
    component: AstroDashboard,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof AstroDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const createHourlyForecast = (dt: number) => ({
    dt,
    clouds: 20,
    weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
});

const getNextDayWeatherData = (currentTime: number): WeatherResponse => ({
    ...mockWeatherResponse,
    current: {
        ...mockWeatherResponse.current,
        dt: currentTime,
        sunset: mockDayData[1].sunset,
        sunrise: mockDayData[1].sunrise,
    },
    daily: [mockDayData[1], mockDayData[2]],
    hourly: Array.from({ length: 48 }, (_, hourOffset) =>
        createHourlyForecast(currentTime + hourOffset * 3600),
    ),
});

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByTestId("location-input");
        await userEvent.type(input, "Test Location");
        await userEvent.click(canvas.getByTestId("search-button"));
    },
};

export const BeforeSearch: Story = {
    ...Default,
    play: undefined,
};

export const Loading: Story = {
    ...Default,
    parameters: {
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(200, mockWeatherResponse, "infinite"),
            ],
        },
    },
};

export const BeforeSunriseShowsCurrentNight: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date("2026-01-02T00:00:00Z"),
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(200, getNextDayWeatherData(mockTimestamps.jan2Midnight)),
            ],
        },
    },
    play: async ({ context, canvas }) => {
        await Default.play!(context);
        const weatherTile = await waitFor(() => canvas.getByTestId("weather-forecast-tile"));
        expect(within(weatherTile).queryByText("00:00")).toBeInTheDocument();
        expect(within(weatherTile).queryByText("23:00")).not.toBeInTheDocument();
    },
};

export const AfterSunriseShowsFollowingNight: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date("2026-01-02T06:00:00Z"),
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(
                    200,
                    getNextDayWeatherData(mockDayData[1].sunrise + 0.5 * 3600),
                ),
            ],
        },
    },
    play: async ({ context, canvas }) => {
        await Default.play!(context);
        const weatherTile = await waitFor(() => canvas.getByTestId("weather-forecast-tile"));
        expect(within(weatherTile).queryByText("21:00")).toBeInTheDocument();
    },
};

export const NoWeatherData: Story = {
    ...Default,
    parameters: {
        ...Default.parameters,
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(500),
            ],
        },
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
    parameters: {
        ...Default.parameters,
        // Dark mode stars are random, so snapshots will always show differences
        chromatic: { disableSnapshot: true },
    },
};
