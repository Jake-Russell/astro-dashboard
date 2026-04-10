import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstronomyProvider } from "../../AstronomyContext";
import { MoonPhaseCard } from "./MoonPhaseCard";

const meta = {
    component: MoonPhaseCard,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof MoonPhaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // TODO
};
