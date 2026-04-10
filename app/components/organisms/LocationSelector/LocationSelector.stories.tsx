import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mocked } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { LocationSelector } from "./LocationSelector";
import { AstronomyProvider } from "../../AstronomyContext";
import { getCurrentPosition } from "services/geolocationService";
import { LocationReverseResponse } from "../../../api/location/types";
import { WeatherResponse } from "../../../api/weather/route";

const getMswLocationReverseLoader = (status: number = 200) => {
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

const getMswLocationSearchLoader = (status: number = 200) => {
    return http.get("/api/location/search", async () => {
        delay(200);

        const response = {
            lat: "11.11",
            lon: "22.22",
            displayName: "Test Location, Test Country",
            ...(status !== 200 && { error: "Failed to fetch location data" }),
        };

        return HttpResponse.json(response, { status });
    });
};

const getMswWeatherLoader = (status: number = 200) => {
    return http.get("/api/weather", async () => {
        delay(200);

        const response: WeatherResponse = {
            lat: 0,
            lon: 0,
            timezone: "",
            timezone_offset: 0,
            current: {
                dt: 0,
                sunrise: 0,
                sunset: 0,
                temp: 0,
                feels_like: 0,
                pressure: 0,
                humidity: 0,
                dew_point: 0,
                uvi: 0,
                clouds: 0,
                visibility: 0,
                wind_speed: 0,
                wind_deg: 0,
                weather: [],
            },
            minutely: [],
            hourly: [],
            daily: [],
            ...(status !== 200 && { error: "Failed to fetch weather data" }),
        };

        return HttpResponse.json(response, { status });
    });
};

const baseHandlers = [
    getMswLocationReverseLoader(),
    getMswLocationSearchLoader(),
    getMswWeatherLoader(),
];

const meta = {
    component: LocationSelector,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof LocationSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: "12.5074",
            longitude: "-10.1278",
        });
    },
    parameters: {
        msw: {
            handlers: baseHandlers,
        },
    },
};

export const Success: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByTestId("use-location-button"));
    },
};

export const Loading: Story = {
    ...Default,
    parameters: {
        msw: {
            // Simulate constant loading state
            handlers: [http.get("/api/weather", () => new Promise(() => {})), ...baseHandlers],
        },
    },
    play: Success.play,
};

export const WithGeoLocationError: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue(
            new Error("User denied geolocation permission"),
        );
    },
    play: Success.play,
};

export const WithReverseLocationApiError: Story = {
    ...Default,
    play: Success.play,
    parameters: {
        msw: {
            handlers: [getMswLocationReverseLoader(500), ...baseHandlers],
        },
    },
};

export const WithSearchLocationApiError: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByTestId("location-input");
        await userEvent.type(input, "Test Location");
        await userEvent.click(canvas.getByTestId("search-button"));
    },
    parameters: {
        msw: {
            handlers: [getMswLocationSearchLoader(500), ...baseHandlers],
        },
    },
};

export const WithWeatherApiError: Story = {
    ...Default,
    play: Success.play,
    parameters: {
        msw: {
            handlers: [getMswWeatherLoader(500), ...baseHandlers],
        },
    },
};
