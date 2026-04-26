import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, TestProjectConfiguration } from "vitest/config";

const dirname =
    typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const storybookProject: TestProjectConfiguration = {
    extends: true,
    plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
            configDir: path.join(dirname, ".storybook"),
        }),
    ],
    test: {
        name: "storybook",
        browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
                {
                    browser: "chromium",
                },
            ],
        },
    },
};

const unitTestsProject: TestProjectConfiguration = {
    extends: true,
    test: {
        name: "unit",
        environment: "jsdom",
        include: ["**/*.unit.{test,spec}.{ts,tsx,js,jsx}"],
        globals: true,
        expect: {
            requireAssertions: true,
        },
        setupFiles: ["./vitest.setup.ts"],
    },
};

export default defineConfig({
    test: {
        projects: [unitTestsProject, storybookProject],
        coverage: {
            thresholds: {
                statements: 90,
                branches: 90,
                functions: 90,
                lines: 90,
            },
        },
        exclude: ["**/*.{mock,mocks}.{ts,js}", "**/*.d.ts", "**/*.scss", ".storybook"],
    },
});
