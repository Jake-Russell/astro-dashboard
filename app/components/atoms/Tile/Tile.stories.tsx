import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tile } from "atoms/Tile";

const meta = {
    component: Tile,
} satisfies Meta<typeof Tile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "Tile Title",
        children: "This is the content of the tile.",
    },
};
