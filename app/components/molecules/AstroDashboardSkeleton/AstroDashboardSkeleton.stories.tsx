import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstroDashboardSkeleton } from "./AstroDashboardSkeleton";

const meta = {
    component: AstroDashboardSkeleton,
} satisfies Meta<typeof AstroDashboardSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
    beforeEach: () => localStorage.setItem("theme", "dark"),
};
