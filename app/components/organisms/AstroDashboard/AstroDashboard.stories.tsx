import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstronomyProvider } from "contexts/AstronomyContext";
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

export const Default: Story = {
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByTestId("location-input");
        await userEvent.type(input, "Test Location");
        await userEvent.click(canvas.getByTestId("search-button"));
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
