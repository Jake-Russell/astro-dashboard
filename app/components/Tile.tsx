import { FunctionComponent } from "react";

type TileProps = {
    title?: string;
    children: React.ReactNode;
    className?: string;
};

const Tile: FunctionComponent<TileProps> = ({ title, children, className = "" }) => {
    return (
        <div
            className={`bg-white border border-gray-200 rounded-xl
        shadow-sm hover:shadow-md transition-shadow duration-300
        p-6 ${className}`}
        >
            {title && (
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    {title}
                </h3>
            )}
            <div className="text-gray-800">{children}</div>
        </div>
    );
};

export default Tile;
