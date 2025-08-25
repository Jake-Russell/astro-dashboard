import { AstronomyProvider } from "./components/AstronomyContext";
import LocationTile from "./components/LocationTile";
import MoonPhaseTile from "./components/MoonPhaseTile";
import SunTile from "./components/SunTile";

const Page = () => {
    return (
        <AstronomyProvider>
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
                    Astro Dashboard
                </h1>

                <div className="flex flex-col gap-4">
                    <LocationTile />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MoonPhaseTile />
                        <SunTile />
                    </div>
                </div>
            </main>
        </AstronomyProvider>
    );
};

export default Page;
