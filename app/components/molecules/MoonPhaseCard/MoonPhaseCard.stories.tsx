import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoonPhaseCard } from "./MoonPhaseCard";

const meta = {
    component: MoonPhaseCard,
} satisfies Meta<typeof MoonPhaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        latitude: 40.7128,
        longitude: -74.006,
        moonriseToday: 1698735600, // Example timestamp
        moonsetToday: 1698782400, // Example timestamp
        moonsetTomorrow: 1698868800, // Example timestamp
        moonPhase: 0.25, // Example phase (first quarter)
    },
    // TODO
};
