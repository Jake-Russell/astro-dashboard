import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstroScoreCard } from "./AstroScoreCard";
import { mockHourlyData } from "mocks/mockWeatherData";

const meta = {
    component: AstroScoreCard,
} satisfies Meta<typeof AstroScoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date("2026-01-01T19:00:00Z");

export const Default: Story = {
    args: {
        latitude: 51.60084,
        longitude: -1.66199,
        moonriseToday: 1767261600, // 2026-01-01T10:00:00Z
        moonsetToday: 1767240000, // 2026-01-01T04:00:00Z
        moonsetTomorrow: 1767326400, // 2026-01-02T04:00:00Z
        moonPhase: 0.25,
        sunsetToday: 1767294000, // 2026-01-01T19:00:00Z
        sunriseTomorrow: 1767330000, // 2026-01-02T05:00:00Z
        hourlyForecast: mockHourlyData.filter((hour) => hour.dt >= now.getTime() / 1000),
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

export const WithHighCloudCover: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyForecast: mockHourlyData
            .filter((hour) => hour.dt >= now.getTime() / 1000)
            .map((hour) => ({
                ...hour,
                clouds: 95,
            })),
    },
};

export const WithLowCloudCover: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyForecast: mockHourlyData
            .filter((hour) => hour.dt >= now.getTime() / 1000)
            .map((hour) => ({
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
        hourlyForecast: mockHourlyData
            .filter((hour) => hour.dt >= now.getTime() / 1000)
            .map((hour) => ({
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
        hourlyForecast: mockHourlyData
            .filter((hour) => hour.dt >= now.getTime() / 1000)
            .map((hour) => ({
                ...hour,
                clouds: 100,
            })),
    },
};

export const InPrimeWindow: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyForecast: mockHourlyData.filter(
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
        hourlyForecast: [],
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
    sunsetToday: Date;
    sunriseTomorrow: Date;
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
        sunsetToday: { control: "date", name: "Sunset Today" },
        sunriseTomorrow: { control: "date", name: "Sunrise Tomorrow" },
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
        sunsetToday: new Date("2026-01-01T19:00:00Z"),
        sunriseTomorrow: new Date("2026-01-02T05:00:00Z"),
        averageCloudCover: 20,
    },
    render: ({
        moonriseToday,
        moonsetToday,
        moonsetTomorrow,
        moonPhase,
        sunsetToday,
        sunriseTomorrow,
        averageCloudCover,
    }) => {
        const formattedMoonriseToday =
            (typeof moonriseToday !== "number" ? moonriseToday.getTime() : moonriseToday) / 1000;
        const formattedMoonsetToday =
            (typeof moonsetToday !== "number" ? moonsetToday.getTime() : moonsetToday) / 1000;
        const formattedMoonsetTomorrow =
            (typeof moonsetTomorrow !== "number" ? moonsetTomorrow.getTime() : moonsetTomorrow) /
            1000;
        const formattedSunsetToday =
            (typeof sunsetToday !== "number" ? sunsetToday.getTime() : sunsetToday) / 1000;
        const formattedSunriseTomorrow =
            (typeof sunriseTomorrow !== "number" ? sunriseTomorrow.getTime() : sunriseTomorrow) /
            1000;

        return (
            <AstroScoreCard
                latitude={51.60084}
                longitude={-1.66199}
                moonriseToday={formattedMoonriseToday}
                moonsetToday={formattedMoonsetToday}
                moonsetTomorrow={formattedMoonsetTomorrow}
                moonPhase={moonPhase}
                sunsetToday={formattedSunsetToday}
                sunriseTomorrow={formattedSunriseTomorrow}
                hourlyForecast={mockHourlyData
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
