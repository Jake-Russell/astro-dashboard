import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, mocked } from "storybook/test";
import { getCurrentPosition } from "services/geolocationService";
import {
    getMswLocationReverseLoader,
    getMswLocationSearchLoader,
    getMswWeatherLoader,
} from "storybook/mswHelpers";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { useAstronomy, type AstronomyContextType } from "contexts/AstronomyContext";
import { LocationSelectorCard } from "./LocationSelectorCard";

const baseHandlers = [getMswLocationReverseLoader(), getMswLocationSearchLoader()];

const createMockContext = (overrides: Partial<AstronomyContextType> = {}): AstronomyContextType => {
    return {
        latitude: 0,
        longitude: 0,
        setLocation: fn(),
        loadingState: "idle",
        setLoadingState: fn(),
        setWeatherDataError: fn(),
        resetWeatherData: fn(),
        ...overrides,
    };
};

const meta = {
    component: LocationSelectorCard,
} satisfies Meta<typeof LocationSelectorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
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

export const LoadingLocation: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });

        mocked(useAstronomy).mockReturnValue(
            createMockContext({ loadingState: "loading-location" }),
        );
    },
};

export const LoadingWeather: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });

        mocked(useAstronomy).mockReturnValue(
            createMockContext({ loadingState: "loading-weather" }),
        );
    },
};
export const DarkMode: Story = {
    ...Default,
    beforeEach: () => {
        localStorage.setItem("theme", "dark");

        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
};

export const WithGeoLocationError: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue(
            new Error("User denied geolocation permission"),
        );

        mocked(useAstronomy).mockReturnValue(createMockContext());
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
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });

        mocked(useAstronomy).mockReturnValue(
            createMockContext({ weatherDataError: "Failed to fetch weather data" }),
        );
    },
    parameters: {
        handlers: [getMswWeatherLoader(500), ...baseHandlers],
    },
};

export const WithLocationAndWeatherApiErrors: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });

        mocked(useAstronomy).mockReturnValue(
            createMockContext({ weatherDataError: "Failed to fetch weather data" }),
        );
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByTestId("location-input");
        await userEvent.type(input, "Test Location");
        await userEvent.click(canvas.getByTestId("search-button"));
    },
    parameters: {
        msw: {
            handlers: [getMswLocationSearchLoader(500), getMswWeatherLoader(500), ...baseHandlers],
        },
    },
};
