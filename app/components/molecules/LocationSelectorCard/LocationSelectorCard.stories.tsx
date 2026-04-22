import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, mocked } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { LocationReverseResponse } from "api/location/types";
import { getCurrentPosition } from "services/geolocationService";
import { LocationSelectorCard } from "./LocationSelectorCard";

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

const baseHandlers = [getMswLocationReverseLoader(), getMswLocationSearchLoader()];

const meta = {
    component: LocationSelectorCard,
} satisfies Meta<typeof LocationSelectorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isWeatherDataLoading: false,
        setLatitude: fn(),
        setLongitude: fn(),
        setWeatherLoading: fn(),
    },
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
    args: {
        ...Default.args,
        isWeatherDataLoading: true,
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
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
    args: {
        ...Default.args,
        weatherDataError: "Failed to fetch weather data",
    },
};
