import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js, "react-hooks": pluginReactHooks, prettier: prettierPlugin },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        rules: {
            "import/prefer-default-export": "off",
            "no-console": "error",
            "no-unreachable": "error",
            "react/react-in-jsx-scope": "off",
            "react-hooks/exhaustive-deps": "warn",
            "react-hooks/rules-of-hooks": "warn",
        },
    },
    globalIgnores([
        "dist",
        "node_modules",
        ".storybook/dist",
        "storybook-static",
        "package-lock.json",
    ]),
]);
