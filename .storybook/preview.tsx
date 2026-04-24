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
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "error",
        },

        mockingDate: new Date("2026-01-01T20:00:00Z"),
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
};

export default preview;
