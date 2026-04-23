import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoonPhaseCircle } from "./MoonPhaseCircle";
import { useEffect } from "react";

const meta = {
    component: MoonPhaseCircle,
} satisfies Meta<typeof MoonPhaseCircle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NewMoon: Story = {
    args: {
        phase: 0,
    },
};

export const WaxingCrescent: Story = {
    ...NewMoon,
    args: {
        phase: 0.125,
    },
};

export const FirstQuarter: Story = {
    ...NewMoon,
    args: {
        phase: 0.25,
    },
};

export const WaxingGibbous: Story = {
    ...NewMoon,
    args: {
        phase: 0.375,
    },
};

export const FullMoon: Story = {
    ...NewMoon,
    args: {
        phase: 0.5,
    },
};

export const WaningGibbous: Story = {
    ...NewMoon,
    args: {
        phase: 0.625,
    },
};

export const LastQuarter: Story = {
    ...NewMoon,
    args: {
        phase: 0.75,
    },
};

export const WaningCrescent: Story = {
    ...NewMoon,
    args: {
        phase: 0.875,
    },
};

export const DarkMode: Story = {
    ...WaxingCrescent,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};

type PlaygroundStoryArgs = {
    phase: number;
    theme: "light" | "dark";
};

export const Playground: StoryObj<PlaygroundStoryArgs> = {
    ...WaxingCrescent,
    args: {
        phase: 0.25,
        theme: "light",
    },
    argTypes: {
        phase: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
        },
        theme: {
            control: { type: "select" },
            options: ["light", "dark"],
        },
    },
    render: ({ phase, theme }) => {
        localStorage.setItem("theme", theme);

        useEffect(() => {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(theme);
        }, [theme]);

        return <MoonPhaseCircle phase={phase} key={theme} />;
    },
};
