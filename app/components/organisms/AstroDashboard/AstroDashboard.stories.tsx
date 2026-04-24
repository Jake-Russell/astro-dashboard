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
    parameters: {
        msw: {
            handlers: [
                getMswLocationReverseLoader(),
                getMswLocationSearchLoader(),
                getMswWeatherLoader(),
            ],
        },
    },
    // TODO
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
    parameters: {
        // Dark mode stars are random, so snapshots will always show differences
        chromatic: { disableSnapshot: true },
    },
};
