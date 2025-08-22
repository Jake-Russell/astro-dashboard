import Tile from "./components/Tile";

const Page = () => {
    return (
        <main className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">Astro Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Tile title="Location">
                    <button className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
                        Use My Location
                    </button>
                </Tile>

                <Tile title="Latitude">
                    <input
                        type="number"
                        className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </Tile>

                <Tile title="Longitude">
                    <input
                        type="number"
                        className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </Tile>

                <Tile title="Forecast">
                    <button className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200">
                        Fetch Forecast
                    </button>
                </Tile>
            </div>
        </main>
    );
};

export default Page;
