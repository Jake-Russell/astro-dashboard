import { LocationSelector } from "molecules/LocationSelectorCard";
import { MoonPhaseCard } from "molecules/MoonPhaseCard";
import { SunCycleCard } from "molecules/SunCycleCard";
import { NightWeatherForecastCard } from "molecules/NightWeatherForecastCard";
import { AstroScoreCard } from "molecules/AstroScoreCard";
import { AstronomyProvider } from "./components/AstronomyContext";

const Page = () => {
    return (
        <AstronomyProvider>
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
                    Astro Dashboard
                </h1>

                <div className="flex flex-col gap-4">
                    <LocationSelector />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MoonPhaseCard />
                        <SunCycleCard />
                    </div>
                    <NightWeatherForecastCard />
                    <AstroScoreCard />
                </div>
            </main>
        </AstronomyProvider>
    );
};

export default Page;
