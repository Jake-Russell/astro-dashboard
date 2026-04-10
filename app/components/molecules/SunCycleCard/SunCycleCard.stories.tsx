import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstronomyProvider } from "../../AstronomyContext";
import { SunCycleCard } from "./SunCycleCard";

const meta = {
    component: SunCycleCard,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof SunCycleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // TODO
};
