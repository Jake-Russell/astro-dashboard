import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstronomyProvider } from "contexts/AstronomyContext";
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
    // TODO
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};
