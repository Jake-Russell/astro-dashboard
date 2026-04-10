import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AstronomyProvider } from "../../AstronomyContext";
import { NightWeatherForecastCard } from "./NightWeatherForecastCard";

const meta = {
    component: NightWeatherForecastCard,
    decorators: [
        (Story) => (
            <AstronomyProvider>
                <Story />
            </AstronomyProvider>
        ),
    ],
} satisfies Meta<typeof NightWeatherForecastCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // TODO
};
