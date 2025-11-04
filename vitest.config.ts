import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true, // enables describe/it/beforeEach globally
        environment: "jsdom", // browser-like environment
        setupFiles: "./vitest.setup.ts",
        include: ["**/*.test.{ts,tsx}"], // pick up test files
    },
});
