import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SunCycleCard } from "./SunCycleCard";

const meta = {
    component: SunCycleCard,
} satisfies Meta<typeof SunCycleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        latitude: 40.7128,
        longitude: -74.006,
        sunrise: 1775798510,
        sunset: 1775847223,
    },
    // TODO
};
