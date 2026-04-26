import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockDayData, mockHourlyData, mockLat, mockLng } from "mocks/mockWeatherData";
import { NightWeatherForecastCard } from "./NightWeatherForecastCard";

const meta = {
    component: NightWeatherForecastCard,
} satisfies Meta<typeof NightWeatherForecastCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        latitude: mockLat,
        longitude: mockLng,
        hourlyForecast: mockHourlyData,
        sunsetToday: mockDayData[0].sunset,
        sunriseTomorrow: mockDayData[1].sunrise,
    },
};

export const WithCloudyNight: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyForecast: mockHourlyData.map((hour) => ({
            ...hour,
            clouds: 90,
        })),
    },
};

export const WithClearNight: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyForecast: mockHourlyData.map((hour) => ({
            ...hour,
            clouds: 5,
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: hour.dt % 86400 < 43200 ? "01d" : "01n",
                },
            ],
        })),
    },
};

export const WithPartlyCloudyNight: Story = {
    ...Default,
    args: {
        ...Default.args,
        hourlyForecast: mockHourlyData.map((hour) => ({
            ...hour,
            clouds: 50,
            weather: [
                {
                    id: 802,
                    main: "Clouds",
                    description: "scattered clouds",
                    icon: hour.dt % 86400 < 43200 ? "03d" : "03n",
                },
            ],
        })),
    },
};

export const DarkMode: Story = {
    ...Default,
    beforeEach: () => localStorage.setItem("theme", "dark"),
};

type PlaygroundStoryArgs = {
    cloudiness: number;
};

export const Playground: StoryObj<PlaygroundStoryArgs> = {
    args: {
        cloudiness: 50,
    },
    argTypes: {
        cloudiness: {
            control: { type: "range", min: 0, max: 100, step: 5 },
            name: "Cloudiness (%)",
        },
    },
    render: ({ cloudiness }) => (
        <NightWeatherForecastCard
            latitude={mockLat}
            longitude={mockLng}
            hourlyForecast={mockHourlyData.map((hour) => ({
                ...hour,
                clouds: cloudiness,
                weather: [
                    {
                        id: cloudiness < 20 ? 800 : cloudiness < 70 ? 802 : 804,
                        main: cloudiness < 20 ? "Clear" : cloudiness < 70 ? "Clouds" : "Clouds",
                        description:
                            cloudiness < 20
                                ? "clear sky"
                                : cloudiness < 70
                                  ? "scattered clouds"
                                  : "overcast clouds",
                        icon:
                            cloudiness < 20
                                ? hour.dt % 86400 < 43200
                                    ? "01d"
                                    : "01n"
                                : cloudiness < 70
                                  ? hour.dt % 86400 < 43200
                                      ? "03d"
                                      : "03n"
                                  : hour.dt % 86400 < 43200
                                    ? "04d"
                                    : "04n",
                    },
                ],
            }))}
            sunsetToday={mockDayData[0].sunset}
            sunriseTomorrow={mockDayData[1].sunrise}
        />
    ),
    parameters: { chromatic: { disableSnapshot: true } },
};
