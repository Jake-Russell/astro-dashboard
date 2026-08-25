import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mocked } from "storybook/test";
import { getMoonPosition } from "suncalc";
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
        moonPhase: mockDayData[0].moon_phase,
        forecastStart: mockDayData[0].sunset,
        forecastEnd: mockDayData[1].sunrise,
        nightHours: mockNightHours,
    },
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: 10,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    },
    parameters: { mockingDate: now },
};

export const WithBrightFullMoonHighInTheSky: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0.5,
    },
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: 90,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    },
};

export const WithBrightFullMoonLowInTheSky: Story = {
    ...WithBrightFullMoonHighInTheSky,
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: 10,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    },
};

export const WithBrightFullMoonBelowHorizon: Story = {
    ...WithBrightFullMoonHighInTheSky,
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: -10,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    },
};

export const WithDarkNewMoonHighInTheSky: Story = {
    ...Default,
    args: {
        ...Default.args,
        moonPhase: 0,
    },
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: 90,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    },
};

export const WithDarkNewMoonLowInTheSky: Story = {
    ...WithDarkNewMoonHighInTheSky,
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: 10,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
    },
};

export const WithDarkNewMoonBelowHorizon: Story = {
    ...WithDarkNewMoonHighInTheSky,
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: -10,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
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
    beforeEach() {
        mocked(getMoonPosition).mockReturnValue({
            altitude: 90,
            azimuth: 0,
            distance: 0,
            parallacticAngle: 0,
        });
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
