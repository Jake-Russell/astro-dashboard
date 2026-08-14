import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { mockDayData, mockHourlyData } from "mocks/mockWeatherData";
import { AstroScoreCard } from "./AstroScoreCard";

const meta = {
    component: AstroScoreCard,
} satisfies Meta<typeof AstroScoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date("2026-01-01T19:00:00Z");
const mockNightHours = mockHourlyData.filter((hour) => hour.dt >= now.getTime() / 1000);

export const Default: Story = {
    args: {
        latitude: mockLat,
        longitude: mockLng,
        moonriseToday: mockDayData[0].moonrise,
        moonsetToday: mockDayData[0].moonset,
        moonsetTomorrow: mockDayData[1].moonset,
        moonPhase: mockDayData[0].moon_phase,
        forecastStart: mockDayData[0].sunset,
        nightEnd: mockDayData[1].sunrise,
        nightHours: mockNightHours,
    },
    parameters: {
        mockingDate: now,
    },
};

export const WithBrightFullMoon: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.5,
    },
};

export const WithDarkNewMoon: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0,
    },
};

export const WithBrightFullMoonBelowHorizon: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.5,
        moonsetToday: 1767294000, // 2026-01-01T19:00:00Z
    },
};

export const WithDarkNewMoonAboveHorizon: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0,
    },
};

export const WithHighCloudCover: Story = {
    ...Default,
    args: {
        ...Default.args,
        nightHours: mockNightHours.map((hour) => ({
            ...hour,
            clouds: 95,
        })),
    },
};

export const WithLowCloudCover: Story = {
    ...Default,
    args: {
        ...Default.args,
        nightHours: mockNightHours.map((hour) => ({
            ...hour,
            clouds: 5,
        })),
    },
};

export const WithPerfectConditions: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0,
        nightHours: mockNightHours.map((hour) => ({
            ...hour,
            clouds: 0,
        })),
        moonsetToday: 1767294000, // 2026-01-01T19:00:00Z
    },
};

export const WithWorstConditions: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.5,
        nightHours: mockNightHours.map((hour) => ({
            ...hour,
            clouds: 100,
        })),
    },
};

export const InPrimeWindow: Story = {
    ...Default,
    args: {
        ...Default.args,
        nightHours: mockHourlyData.filter(
            (hour) => hour.dt >= new Date("2026-01-01T21:00:00Z").getTime() / 1000,
        ),
    },
    parameters: {
        mockingDate: new Date("2026-01-01T21:00:00Z"),
    },
};

export const OutsidePrimeWindow: Story = {
    ...Default,
    parameters: {
        mockingDate: new Date("2026-01-01T19:00:00Z"),
    },
};

export const WithNoNightHours: Story = {
    ...Default,
    args: {
        ...Default.args,
        nightHours: [],
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};

type PlaygroundStoryArgs = {
    moonriseToday: Date;
    moonsetToday: Date;
    moonsetTomorrow: Date;
    moonPhase: number;
    nightStart: Date;
    nightEnd: Date;
    averageCloudCover: number;
};

export const Playground: StoryObj<PlaygroundStoryArgs> = {
    argTypes: {
        moonriseToday: { control: "date", name: "Moonrise Today" },
        moonsetToday: { control: "date", name: "Moonset Today" },
        moonsetTomorrow: { control: "date", name: "Moonset Tomorrow" },
        moonPhase: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
            name: "Moon Phase (0: New Moon, 0.5: Full Moon, 1: New Moon)",
        },
        nightStart: { control: "date", name: "Night Start" },
        nightEnd: { control: "date", name: "Night End" },
        averageCloudCover: {
            control: { type: "range", min: 0, max: 100, step: 1 },
            name: "Avg Cloud Cover",
        },
    },
    args: {
        moonriseToday: new Date("2026-01-01T10:00:00Z"),
        moonsetToday: new Date("2026-01-01T04:00:00Z"),
        moonsetTomorrow: new Date("2026-01-02T04:00:00Z"),
        moonPhase: 0.25,
        nightStart: new Date("2026-01-01T19:00:00Z"),
        nightEnd: new Date("2026-01-02T05:00:00Z"),
        averageCloudCover: 20,
    },
    render: ({
        moonriseToday,
        moonsetToday,
        moonsetTomorrow,
        moonPhase,
        nightStart,
        nightEnd,
        averageCloudCover,
    }) => {
        const formattedMoonriseToday =
            (typeof moonriseToday !== "number" ? moonriseToday.getTime() : moonriseToday) / 1000;
        const formattedMoonsetToday =
            (typeof moonsetToday !== "number" ? moonsetToday.getTime() : moonsetToday) / 1000;
        const formattedMoonsetTomorrow =
            (typeof moonsetTomorrow !== "number" ? moonsetTomorrow.getTime() : moonsetTomorrow) /
            1000;
        const formattedNightStart =
            (typeof nightStart !== "number" ? nightStart.getTime() : nightStart) / 1000;
        const formattedNightEnd =
            (typeof nightEnd !== "number" ? nightEnd.getTime() : nightEnd) / 1000;

        return (
            <AstroScoreCard
                latitude={mockLat}
                longitude={mockLng}
                moonriseToday={formattedMoonriseToday}
                moonsetToday={formattedMoonsetToday}
                moonsetTomorrow={formattedMoonsetTomorrow}
                moonPhase={moonPhase}
                forecastStart={formattedNightStart}
                nightEnd={formattedNightEnd}
                nightHours={mockHourlyData
                    .filter((hour) => hour.dt >= now.getTime() / 1000)
                    .map((hour) => ({
                        ...hour,
                        clouds: averageCloudCover,
                    }))}
            />
        );
    },
    parameters: {
        mockingDate: now,
        chromatic: { disableSnapshot: true },
    },
};
