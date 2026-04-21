"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null;

        let initialTheme: Theme;
        if (storedTheme) {
            initialTheme = storedTheme;
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            initialTheme = prefersDark ? "dark" : "light";
        }

        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const htmlElement = document.documentElement;
        if (newTheme === "dark") {
            htmlElement.classList.remove("light");
            htmlElement.classList.add("dark");
        } else {
            htmlElement.classList.remove("dark");
            htmlElement.classList.add("light");
        }
    };

    const toggleTheme = () => {
        const newTheme: Theme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
