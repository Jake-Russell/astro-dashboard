import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StarsBackground } from "./StarsBackground";

const meta = {
    component: StarsBackground,
    decorators: [
        (Story) => (
            <div className="relative w-full h-screen bg-gray-900">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StarsBackground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
