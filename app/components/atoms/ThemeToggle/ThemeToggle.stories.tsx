import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "contexts/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

const meta = {
    component: ThemeToggle,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
    beforeEach: () => {
        localStorage.setItem("theme", "light");
    },
};

export const Dark: Story = {
    beforeEach: () => {
        localStorage.setItem("theme", "dark");
    },
};
