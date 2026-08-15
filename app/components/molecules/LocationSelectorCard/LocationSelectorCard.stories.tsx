import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, mocked } from "storybook/test";
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
            new Error(
                "User denied geolocation permission. You can try again, or search for a location instead.",
            ),
        );

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
    play: Success.play,
};

export const WithPermissionDeniedError: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "PERMISSION_DENIED",
            message:
                "Location permission was denied. You can enable location access in your browser settings, or search for a location instead.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
    play: Success.play,
};

export const WithTimeoutError: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "TIMEOUT",
            message:
                "We couldn't get your location in time. Please try again or search for a location instead.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
    play: Success.play,
};

export const WithPositionUnavailableError: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "POSITION_UNAVAILABLE",
            message:
                "Your device's location could not be determined. Please try again or search for a location instead.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
    play: Success.play,
};

export const WithUnsupportedBrowserError: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "UNSUPPORTED",
            message: "Your browser does not support device location.",
        });

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

export const RetryLocation: Story = {
    ...WithTimeoutError,
    beforeEach() {
        mocked(getCurrentPosition)
            .mockRejectedValueOnce({
                code: "TIMEOUT",
                message:
                    "We couldn't get your location in time. Please try again or search for a location instead.",
            })
            .mockResolvedValueOnce({
                latitude: mockLat,
                longitude: mockLng,
            });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
    play: async ({ context, canvas, userEvent }) => {
        await Success.play!(context);
        const retryLocationButton = canvas.getByTestId("retry-location-button");
        await userEvent.click(retryLocationButton);
        expect(retryLocationButton).not.toBeInTheDocument();
    },
    parameters: {
        msw: { handlers: baseHandlers },
        chromatic: { disableSnapshot: true },
    },
};

export const SearchAfterLocationError: Story = {
    ...RetryLocation,
    play: async ({ context, canvas, userEvent }) => {
        await Success.play!(context);
        const searchLocationButton = canvas.getByTestId("search-location-button");
        await userEvent.click(searchLocationButton);
        await userEvent.keyboard("Test Location{Enter}");
        expect(searchLocationButton).not.toBeInTheDocument();
    },
};
