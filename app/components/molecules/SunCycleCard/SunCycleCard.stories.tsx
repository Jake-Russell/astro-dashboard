import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { mockDayData } from "mocks/mockWeatherData";
import { SunCycleCard } from "./SunCycleCard";

const meta = {
    component: SunCycleCard,
} satisfies Meta<typeof SunCycleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        latitude: mockLat,
        longitude: mockLng,
        sunrise: mockDayData[0].sunrise,
        sunset: mockDayData[0].sunset,
        tomorrowSunrise: mockDayData[1].sunrise,
    },
};

export const WithSunUp: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date(mockDayData[0].sunrise * 1000 + 3600 * 1000), // 1 hour after sunrise
    },
};

export const WithSunDown: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date(mockDayData[0].sunset * 1000 + 3600 * 1000), // 1 hour after sunset
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};

type PlaygroundStoryArgs = {
    isSunUp: boolean;
};

export const Playground: StoryObj<PlaygroundStoryArgs> = {
    args: {
        isSunUp: true,
    },
    argTypes: {
        isSunUp: {
            type: "boolean",
            name: "Is Sun Up?",
        },
    },
    render: ({ isSunUp }) => (
        <SunCycleCard
            latitude={mockLat}
            longitude={mockLng}
            sunrise={mockDayData[0].sunrise}
            sunset={isSunUp ? mockDayData[0].sunset + 3600 : mockDayData[0].sunset}
            tomorrowSunrise={mockDayData[1].sunrise}
        />
    ),
    parameters: { chromatic: { disableSnapshot: true } },
};
