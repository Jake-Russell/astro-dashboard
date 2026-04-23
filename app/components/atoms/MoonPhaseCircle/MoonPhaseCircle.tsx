import { FunctionComponent } from "react";
import { MoonPhaseCircleProps } from "./types";

export const MoonPhaseCircle: FunctionComponent<MoonPhaseCircleProps> = ({ phase }) => {
    const p = Math.max(0, Math.min(1, phase));

    const size = 140;
    const r = 60;
    const cx = size / 2;
    const cy = size / 2;

    const isWaning = p > 0.5;

    /**
     * Normalize phase:
     * 0 → 0.5 maps to 0 → 1
     * 0.5 → 1 maps to 0 → 1
     */
    const t = isWaning ? (p - 0.5) * 2 : p * 2;

    const k = Math.cos(t * Math.PI);

    const rx = Math.abs(k) * r;

    const sweepFlag = k > 0 ? 0 : 1;

    const path = `
        M ${cx} ${cy - r}
        A ${r} ${r} 0 1 1 ${cx} ${cy + r}
        A ${rx} ${r} 0 1 ${sweepFlag} ${cx} ${cy - r}
        Z
    `;

    return (
        <div className="flex items-center justify-center">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="drop-shadow-lg"
                style={{
                    filter: "drop-shadow(0 0 20px rgba(129, 140, 248, 0.3))",
                }}
            >
                <defs>
                    <filter id="moonGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Base circle with gradient */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={isWaning ? "var(--accent-primary)" : "var(--card-bg)"}
                    opacity="0.9"
                    className="transition-all duration-500"
                />

                {/* Illumination path */}
                <path
                    d={path}
                    fill={isWaning ? "var(--card-bg)" : "var(--accent-primary)"}
                    opacity="0.95"
                    filter="url(#moonGlow)"
                    style={{ transition: "all 0.5s ease" }}
                    className="group-hover:opacity-100"
                />

                {/* Subtle rim with accent color */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="var(--accent-secondary)"
                    strokeWidth="0.5"
                    opacity="0.3"
                    className="transition-opacity duration-500"
                />
            </svg>
        </div>
    );
};
