import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoonPhaseCard } from "./MoonPhaseCard";
import { mockDayData, mockLat, mockLng } from "mocks/mockWeatherData";

const meta = {
    component: MoonPhaseCard,
} satisfies Meta<typeof MoonPhaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        latitude: mockLat,
        longitude: mockLng,
        moonriseToday: mockDayData[0].moonrise,
        moonsetToday: mockDayData[0].moonset,
        moonsetTomorrow: mockDayData[1].moonset,
        moonPhase: mockDayData[0].moon_phase,
    },
};

export const WithNewMoon0: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0,
    },
};

export const WithWaxingCrescent: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.125,
    },
};

export const WithFirstQuarter: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.25,
    },
};

export const WithWaxingGibbous: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.375,
    },
};

export const WithFullMoon: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.5,
    },
};

export const WithWaningGibbous: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.625,
    },
};

export const WithLastQuarter: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.75,
    },
};

export const WithWaningCrescent: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.875,
    },
};

export const WithNewMoon1: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 1,
    },
};

export const WithMoonUp: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date(mockDayData[0].moonrise * 1000 + 3600 * 1000), // 1 hour after moonrise
    },
};

export const WithMoonDown: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date(mockDayData[0].moonset * 1000 + 3600 * 1000), // 1 hour after moonset
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};

type PlaygroundStoryArgs = {
    isMoonUp: boolean;
    moonPhase: number;
};

export const Playground: StoryObj<PlaygroundStoryArgs> = {
    args: {
        isMoonUp: true,
        moonPhase: 0.5,
    },
    argTypes: {
        isMoonUp: {
            type: "boolean",
            name: "Is Moon Up?",
        },
        moonPhase: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
            name: "Moon Phase",
        },
    },
    render: ({ isMoonUp, moonPhase }) => (
        <MoonPhaseCard
            latitude={mockLat}
            longitude={mockLng}
            moonriseToday={mockDayData[0].moonrise}
            moonsetToday={isMoonUp ? mockDayData[0].moonset : mockDayData[0].moonset - 8 * 3600}
            moonsetTomorrow={mockDayData[1].moonset}
            moonPhase={moonPhase}
        />
    ),
    parameters: { chromatic: { disableSnapshot: true } },
};
