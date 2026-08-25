import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFoundContent } from "./NotFoundContent";

const meta = {
    component: NotFoundContent,
} satisfies Meta<typeof NotFoundContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};
