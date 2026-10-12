import type { FunctionComponent, PropsWithChildren } from "react";
import type { TileProps } from "./types";

export const Tile: FunctionComponent<PropsWithChildren<TileProps>> = ({
    title,
    heading = "h2",
    testId,
    interactive = true,
    children,
}) => {
    const HeadingTag = heading;

    return (
        <div
            className={`relative overflow-hidden bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-md ease-out p-6 md:p-8 transition-shadow duration-200 ${
                interactive ? "group hover:shadow-lg" : ""
            }`}
            data-testid={testId}
        >
            {/* Gradient accent line top */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-(--accent-primary) via-(--accent-secondary) to-(--accent-tertiary) opacity-0 transition-opacity duration-200 ${
                    interactive ? "group-hover:opacity-100" : ""
                }`}
            />

            {title && (
                <div className="mb-4">
                    <HeadingTag
                        className={`text-xs font-bold uppercase tracking-widest text-(--text-secondary) transition-colors duration-200 ${
                            interactive ? "group-hover:text-(--accent-primary)" : ""
                        }`}
                    >
                        {title}
                    </HeadingTag>
                </div>
            )}
            <div className="text-foreground">{children}</div>
        </div>
    );
};
