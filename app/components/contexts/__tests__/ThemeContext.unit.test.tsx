import { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../ThemeContext";

const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeContext", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = "";
        vi.restoreAllMocks();
    });

    it("should initialize theme from localStorage", () => {
        localStorage.setItem("theme", "dark");

        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toBe("dark");
    });

    it("should fallback to system preference when no stored theme", () => {
        const mockMediaQueryList: Partial<MediaQueryList> = {
            matches: true,
            media: "",
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        };

        vi.spyOn(window, "matchMedia").mockImplementation(
            () => mockMediaQueryList as MediaQueryList,
        );

        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toBe("dark");
    });

    it("should toggle theme and update localStorage and DOM", () => {
        localStorage.setItem("theme", "light");

        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => result.current.toggleTheme());

        expect(result.current.theme).toBe("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);

        act(() => result.current.toggleTheme());

        expect(result.current.theme).toBe("light");
        expect(localStorage.getItem("theme")).toBe("light");
        expect(document.documentElement.classList.contains("light")).toBe(true);
    });

    it("should throw error when used outside provider", () => {
        expect(() => renderHook(() => useTheme())).toThrow(
            "useTheme must be used within a ThemeProvider",
        );
    });
});
