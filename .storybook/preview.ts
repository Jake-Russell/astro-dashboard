import type { Preview } from "@storybook/nextjs-vite";
import { initialize as initializeMSW, mswLoader } from "msw-storybook-addon";
import "../app/globals.css";

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
    },
    loaders: [mswLoader],
};

export default preview;
