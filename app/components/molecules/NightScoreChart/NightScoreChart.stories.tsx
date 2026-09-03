import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
import { mockLat, mockLng } from "mocks/mockLocationData";
import { mockDayData, mockHourlyData } from "mocks/mockWeatherData";
import { getNightForecastHours } from "utils/nightForecastUtils";
import { NightScoreChart } from "./NightScoreChart";
import { HourlyAstroScore } from "molecules/AstroScoreCard";

const meta = {
    component: NightScoreChart,
} satisfies Meta<typeof NightScoreChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockNightHours = getNightForecastHours(mockHourlyData, {
    forecastStart: mockDayData[0].sunset,
    forecastEnd: mockDayData[1].sunrise,
});

const mockHourlyScores: HourlyAstroScore[] = mockNightHours.map((hour, idx) => {
    const scores = [
        {
            score: 7.8,
            cloud: 5.4,
            moonTotal: 2.4,
            moonIllumination: 1.2,
            moonAltitude: 1.2,
            cloudCoverage: 10,
            moonAltitudeValue: 12.4,
        },
        {
            score: 8.6,
            cloud: 5.7,
            moonTotal: 2.9,
            moonIllumination: 1.5,
            moonAltitude: 1.4,
            cloudCoverage: 5,
            moonAltitudeValue: 8.7,
        },
        {
            score: 9.1,
            cloud: 5.9,
            moonTotal: 3.2,
            moonIllumination: 1.7,
            moonAltitude: 1.5,
            cloudCoverage: 2,
            moonAltitudeValue: 4.2,
        },
        {
            score: 8.3,
            cloud: 5.2,
            moonTotal: 3.1,
            moonIllumination: 1.8,
            moonAltitude: 1.3,
            cloudCoverage: 13,
            moonAltitudeValue: 2.1,
        },
        {
            score: 6.9,
            cloud: 4.4,
            moonTotal: 2.5,
            moonIllumination: 1.6,
            moonAltitude: 0.9,
            cloudCoverage: 27,
            moonAltitudeValue: -1.8,
        },
        {
            score: 5.4,
            cloud: 3.6,
            moonTotal: 1.8,
            moonIllumination: 1.2,
            moonAltitude: 0.6,
            cloudCoverage: 40,
            moonAltitudeValue: -8.5,
        },
        {
            score: 3.8,
            cloud: 2.4,
            moonTotal: 1.4,
            moonIllumination: 0.9,
            moonAltitude: 0.5,
            cloudCoverage: 60,
            moonAltitudeValue: -16.3,
        },
        {
            score: 2.7,
            cloud: 1.5,
            moonTotal: 1.2,
            moonIllumination: 0.8,
            moonAltitude: 0.4,
            cloudCoverage: 75,
            moonAltitudeValue: -24.7,
        },
        {
            score: 4.2,
            cloud: 3.0,
            moonTotal: 1.2,
            moonIllumination: 0.7,
            moonAltitude: 0.5,
            cloudCoverage: 50,
            moonAltitudeValue: -32.1,
        },
        {
            score: 4.2,
            cloud: 3.0,
            moonTotal: 1.2,
            moonIllumination: 0.7,
            moonAltitude: 0.5,
            cloudCoverage: 50,
            moonAltitudeValue: -32.1,
        },
        {
            score: 4.2,
            cloud: 3.0,
            moonTotal: 1.2,
            moonIllumination: 0.7,
            moonAltitude: 0.5,
            cloudCoverage: 50,
            moonAltitudeValue: -32.1,
        },
    ];

    const data = scores[idx];

    return {
        time: hour.dt,
        endTime: hour.dt + 3600,
        score: data.score,
        breakdown: {
            cloud: data.cloud,
            moon: {
                total: data.moonTotal,
                illumination: data.moonIllumination,
                altitude: data.moonAltitude,
            },
        },
        cloudCoverage: data.cloudCoverage,
        moonAltitude: data.moonAltitudeValue,
    };
});

export const Default: Story = {
    args: {
        hourlyScores: mockHourlyScores,
        latitude: mockLat,
        longitude: mockLng,
    },
};

export const WithPrimeWindow: Story = {
    ...Default,
    args: {
        ...Default.args,
        primeTimeStart: mockHourlyScores[2].time,
        primeTimeEnd: mockHourlyScores[3].endTime,
    },
};

export const InPrimeWindow: Story = {
    ...Default,
    args: {
        ...Default.args,
        primeTimeStart: mockHourlyScores[0].time,
        primeTimeEnd: mockHourlyScores[1].endTime,
    },
};

export const WithSingleHour: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyScores: [mockHourlyScores[0]],
    },
};

export const WithNoScores: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyScores: [],
    },
};

export const ScrollableOnMobile: Story = {
    ...Default,
    globals: {
        viewport: { value: "mobile1", isRotated: false },
    },
};

export const WithTooltipActive: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const firstBar = canvas.getAllByRole("button")[0];
        await userEvent.hover(firstBar);
    },
};

export const HoverShowsTooltip: Story = {
    ...WithTooltipActive,
    play: async ({ context, canvas }) => {
        await WithTooltipActive.play!(context);
        expect(canvas.getByTestId("night-score-chart-tooltip")).toBeInTheDocument();
    },
    parameters: { chromatic: { disableSnapshot: true } },
};

export const HoverThenUnhoverHidesTooltip: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const firstBar = canvas.getAllByRole("button")[0];
        await userEvent.hover(firstBar);
        expect(canvas.getByTestId("night-score-chart-tooltip")).toBeInTheDocument();

        await userEvent.unhover(firstBar);
        expect(canvas.queryByTestId("night-score-chart-tooltip")).not.toBeInTheDocument();
    },
    parameters: { chromatic: { disableSnapshot: true } },
};

export const ClickShowsTooltip: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const firstBar = canvas.getAllByRole("button")[0];
        await userEvent.click(firstBar);
        expect(canvas.getByTestId("night-score-chart-tooltip")).toBeInTheDocument();
    },
    parameters: { chromatic: { disableSnapshot: true } },
};

export const ClickBackgroundHidesTooltip: Story = {
    ...ClickShowsTooltip,
    play: async ({ context, canvas, canvasElement, userEvent }) => {
        await ClickShowsTooltip.play!(context);

        await userEvent.click(canvasElement);
        expect(canvas.queryByTestId("night-score-chart-tooltip")).not.toBeInTheDocument();
    },
    parameters: { chromatic: { disableSnapshot: true } },
};

export const TabMovesTooltipToNextBar: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const bars = canvas.getAllByRole("button");
        bars[0].focus();
        await waitFor(() =>
            expect(canvas.getByTestId("night-score-chart-tooltip")).toBeInTheDocument(),
        );

        await userEvent.tab();
        expect(canvas.getByTestId("night-score-chart-tooltip")).toBeInTheDocument();
    },
    parameters: { chromatic: { disableSnapshot: true } },
};

export const TabOnLastBarHidesTooltip: Story = {
    ...Default,
    play: async ({ canvas, userEvent }) => {
        const bars = canvas.getAllByRole("button");
        bars[bars.length - 1].focus();
        await waitFor(() =>
            expect(canvas.getByTestId("night-score-chart-tooltip")).toBeInTheDocument(),
        );

        await userEvent.tab();
        expect(canvas.queryByTestId("night-score-chart-tooltip")).not.toBeInTheDocument();
    },
    parameters: { chromatic: { disableSnapshot: true } },
};
