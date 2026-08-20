import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse } from "msw";
import { expect, mocked, waitFor } from "storybook/test";
import { getCurrentPosition } from "services/geolocationService";
import {
    getMswLocationReverseLoader,
    getMswLocationSearchLoader,
    getMswWeatherLoader,
} from "storybook/mswHelpers";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { AstronomyProvider } from "contexts/AstronomyContext";
import { LocationSelectorCard } from "./LocationSelectorCard";

const meta = {
    component: LocationSelectorCard,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof LocationSelectorCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    beforeEach() {
        mocked(getCurrentPosition).mockResolvedValue({
            latitude: mockLat,
            longitude: mockLng,
        });
    },
    parameters: {
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(),
            ],
        },
    },
};

export const LoadingLocation: Story = {
    ...Default,
    beforeEach() {
        mocked(getCurrentPosition).mockReturnValue(new Promise(() => {}));
    },
};

export const LoadingWeather: Story = {
    ...Default,
    parameters: {
        ...Default.parameters,
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(200, undefined, "infinite"),
            ],
        },
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
    },
};

export const WithUnsupportedBrowserError: Story = {
    ...SuccessUsingCurrentLocation,
    beforeEach() {
        mocked(getCurrentPosition).mockRejectedValue({
            code: "UNSUPPORTED",
            message: "Your browser does not support device location.",
        });
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
    ...SuccessSearchingLocation,
    parameters: {
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
    ...SuccessSearchingLocation,
    play: async ({ context, canvas, userEvent }) => {
        await SuccessSearchingLocation.play!(context);

        await waitFor(() =>
            expect(canvas.getByTestId("location-selector-error")).toBeInTheDocument(),
        );

        await userEvent.click(canvas.getByTestId("retry-weather-button"));

        await waitFor(() =>
            expect(canvas.queryByTestId("location-selector-error")).not.toBeInTheDocument(),
        );
    },
    parameters: {
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                // Fails the first weather request only, then falls through to a
                // normal successful response on the retry.
                http.get(
                    "/api/weather",
                    () =>
                        HttpResponse.json(
                            { error: "Failed to fetch weather data" },
                            { status: 500 },
                        ),
                    { once: true },
                ),
                getMswWeatherLoader(),
            ],
        },
        chromatic: { disableSnapshot: true },
    },
};

export const ChangeLocationAfterWeatherError: Story = {
    ...SuccessSearchingLocation,
    play: async ({ context, canvas, userEvent }) => {
        await SuccessSearchingLocation.play!(context);

        await waitFor(() =>
            expect(canvas.getByTestId("location-selector-error")).toBeInTheDocument(),
        );

        await userEvent.click(canvas.getByTestId("change-location-button"));

        expect(canvas.getByTestId("location-input")).toHaveValue("");
        expect(canvas.queryByTestId("location-selector-error")).not.toBeInTheDocument();
    },
    parameters: {
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(500),
            ],
        },
        chromatic: { disableSnapshot: true },
    },
};
