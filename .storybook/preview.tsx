import type { Preview } from "@storybook/nextjs-vite";
import { sb } from "storybook/test";
import { initialize as initializeMSW, mswLoader } from "msw-storybook-addon";
import { ThemeProvider } from "../app/components/contexts/ThemeContext.tsx";

import "../app/globals.css";

sb.mock(import("../app/services/geolocationService.ts"), { spy: true });

initializeMSW({
    onUnhandledRequest: "bypass",
    serviceWorker: {
        // Reduce service worker scope to minimise overhead
        options: {
            scope: "/",
        },
    },
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            test: "error",
        },

        mockingDate: new Date(new Date("2026-01-01T19:00:00Z")),
    },
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
    beforeEach: () => localStorage.setItem("theme", "light"),
    loaders: [mswLoader],
    tags: ["autodocs"],
};

export default preview;
