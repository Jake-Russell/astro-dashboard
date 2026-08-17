import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, mocked } from "storybook/test";
import { getCurrentPosition } from "services/geolocationService";
import { getMswLocationReverseLoader, getMswLocationSearchLoader } from "storybook/mswHelpers";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { useAstronomy, type AstronomyContextType } from "contexts/AstronomyContext";
import { LocationSelectorCard } from "./LocationSelectorCard";

const createMockContext = (overrides: Partial<AstronomyContextType> = {}): AstronomyContextType => {
    return {
        latitude: 0,
        longitude: 0,
        setLocation: fn(),
        loadingState: "idle",
        setLoadingState: fn(),
        setWeatherDataError: fn(),
        resetWeatherData: fn(),
        retryWeather: fn(),
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
        msw: { handlers: [getMswLocationReverseLoader(), getMswLocationSearchLoader()] },
    },
};

export const LoadingLocation: Story = {
    ...Default,
    beforeEach() {
        mocked(useAstronomy).mockReturnValue(
            createMockContext({ loadingState: "loading-location" }),
        );
    },
};

export const LoadingWeather: Story = {
    ...Default,
    beforeEach() {
        mocked(useAstronomy).mockReturnValue(
            createMockContext({
                latitude: mockLat,
                longitude: mockLng,
                loadingState: "loading-weather",
            }),
        );
    },
};

export const SuccessUsingCurrentLocation: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByTestId("use-location-button"));
    },
};

export const SuccessSearchingLocation: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByTestId("location-input");

        await userEvent.type(input, "Test Location");
        await userEvent.click(canvas.getByTestId("search-button"));
    },
};

export const WithPermissionDeniedError: Story = {
    ...SuccessUsingCurrentLocation,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "PERMISSION_DENIED",
            message:
                "Location permission was denied. You can enable location access in your browser settings, or search for a location instead.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
};

export const WithTimeoutError: Story = {
    ...SuccessUsingCurrentLocation,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "TIMEOUT",
            message:
                "We couldn't get your location in time. Please try again or search for a location instead.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
};

export const WithPositionUnavailableError: Story = {
    ...SuccessUsingCurrentLocation,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "POSITION_UNAVAILABLE",
            message:
                "Your device's location could not be determined. Please try again or search for a location instead.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
};

export const WithUnsupportedBrowserError: Story = {
    ...SuccessUsingCurrentLocation,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "UNSUPPORTED",
            message: "Your browser does not support device location.",
        });

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
};

export const WithReverseLocationApiError: Story = {
    ...SuccessUsingCurrentLocation,
    parameters: {
        ...SuccessSearchingLocation.parameters,
        msw: { handlers: [getMswLocationReverseLoader(500), getMswLocationSearchLoader()] },
    },
};

export const WithSearchLocationApiError: Story = {
    ...SuccessSearchingLocation,
    parameters: {
        ...SuccessSearchingLocation.parameters,
        msw: { handlers: [getMswLocationReverseLoader(), getMswLocationSearchLoader(500)] },
    },
};

export const WithWeatherApiError: Story = {
    ...Default,
    beforeEach() {
        mocked(useAstronomy).mockReturnValue(
            createMockContext({
                latitude: mockLat,
                longitude: mockLng,
                weatherDataError: "Failed to fetch weather data",
            }),
        );
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach() {
        localStorage.setItem("theme", "dark");

        mocked(useAstronomy).mockReturnValue(createMockContext());
    },
};

/* -------------------------------------------------------------------------- */
/* Interaction Tests                                                          */
/* -------------------------------------------------------------------------- */

export const RetryLocation: Story = {
    ...SuccessUsingCurrentLocation,
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
        await SuccessUsingCurrentLocation.play!(context);

        expect(canvas.queryByTestId("location-selector-error")).toBeInTheDocument();

        const retryLocationButton = canvas.queryByTestId("retry-location-button");
        await userEvent.click(retryLocationButton!);

        expect(canvas.queryByTestId("location-selector-error")).not.toBeInTheDocument();
    },
    parameters: {
        ...SuccessUsingCurrentLocation.parameters,
        chromatic: { disableSnapshot: true },
    },
};

export const SearchAfterLocationError: Story = {
    ...RetryLocation,
    play: async ({ context, canvas, userEvent }) => {
        await SuccessUsingCurrentLocation.play!(context);

        expect(canvas.queryByTestId("location-selector-error")).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId("search-location-button"));

        await SuccessSearchingLocation.play!(context);

        expect(canvas.queryByTestId("location-selector-error")).not.toBeInTheDocument();
    },
};

export const RetryWeather: Story = {
    ...WithWeatherApiError,
    play: async ({ canvas, userEvent }) => {
        const context = mocked(useAstronomy).mock.results[0]?.value as AstronomyContextType;
        expect(canvas.queryByTestId("location-selector-error")).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId("retry-weather-button"));
        expect(context.retryWeather).toHaveBeenCalledOnce();
    },
    parameters: {
        ...WithWeatherApiError.parameters,
        chromatic: { disableSnapshot: true },
    },
};

export const ChangeLocationAfterWeatherError: Story = {
    ...WithWeatherApiError,
    play: async ({ context, canvas, userEvent }) => {
        const astroContext = mocked(useAstronomy).mock.results[0]?.value as AstronomyContextType;

        expect(canvas.queryByTestId("location-selector-error")).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId("change-location-button"));
        expect(astroContext.resetWeatherData).toHaveBeenCalledOnce();

        await SuccessSearchingLocation.play!(context);
    },
    parameters: {
        ...WithWeatherApiError.parameters,
        chromatic: { disableSnapshot: true },
    },
};
