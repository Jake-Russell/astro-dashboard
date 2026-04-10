import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstronomyProvider } from "../../AstronomyContext";
import { AstroScoreCard } from "./AstroScoreCard";

const meta = {
    component: AstroScoreCard,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof AstroScoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // TODO
};
