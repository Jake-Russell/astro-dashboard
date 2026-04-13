import { FunctionComponent, PropsWithChildren } from "react";
import { TileProps } from "./types";

export const Tile: FunctionComponent<PropsWithChildren<TileProps>> = ({
    title,
    heading = "h3",
    children,
}) => {
    const HeadingTag = heading;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            {title && (
                <HeadingTag className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    {title}
                </HeadingTag>
            )}
            <div className="text-gray-800">{children}</div>
        </div>
    );
};
