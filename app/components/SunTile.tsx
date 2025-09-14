"use client";
import { useAstronomy } from "./AstronomyContext";
import Tile from "./Tile";

const SunTile = () => {
    const { astronomyData, astronomyLoading } = useAstronomy();

    return (
        <Tile title="Sun">
            <div className="flex flex-col items-center">
                {astronomyLoading && <div>Loading...</div>}
                {!astronomyLoading && astronomyData && !astronomyData.error && (
                    <>
                        <div className="text-2xl mb-2 font-semibold">
                            Sunrise: {astronomyData.sunrise}
                        </div>
                        <div className="text-2xl mb-2 font-semibold">
                            Sunset: {astronomyData.sunset}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                            {astronomyData.is_sun_up ? "Sun is up" : "Sun is down"}
                        </div>
                    </>
                )}
                {!astronomyLoading && astronomyData && astronomyData.error && (
                    <div className="text-red-500 text-sm">{astronomyData.error}</div>
                )}
            </div>
        </Tile>
    );
};

export default SunTile;
