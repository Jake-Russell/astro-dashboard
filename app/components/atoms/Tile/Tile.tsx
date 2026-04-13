import { FunctionComponent, PropsWithChildren } from "react";
import { TileProps } from "./types";

export const Tile: FunctionComponent<PropsWithChildren<TileProps>> = ({
    title,
    heading = "h3",
    children,
}) => {
    const HeadingTag = heading;

    return (
        <div className="relative overflow-hidden bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-out p-6 md:p-8 group backdrop-blur-sm">
            {/* Gradient accent line top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-(--accent-primary) via-(--accent-secondary) to-(--accent-tertiary) opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {title && (
                <div className="mb-4">
                    <HeadingTag className="text-xs font-bold uppercase tracking-widest text-(--text-secondary) group-hover:text-(--accent-primary) transition-colors duration-300">
                        {title}
                    </HeadingTag>
                </div>
            )}
            <div className="text-foreground">{children}</div>
        </div>
    );
};
