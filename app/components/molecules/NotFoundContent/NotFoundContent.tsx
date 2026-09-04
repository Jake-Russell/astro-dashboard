import Link from "next/link";
import { StarsBackground, Tile } from "atoms";

export const NotFoundContent = () => {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
            <div className="light:none dark:block absolute inset-0 z-0 pointer-events-none">
                <div className="relative w-full h-full min-h-screen">
                    <StarsBackground />
                </div>
            </div>
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 -left-1/2 w-full h-96 bg-linear-to-br from-(--accent-primary)/10 via-(--accent-secondary)/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-96 bg-linear-to-tl from-(--accent-tertiary)/10 via-(--accent-secondary)/5 to-transparent rounded-full blur-3xl" />
            </div>
            <div className="max-w-xl w-full relative">
                <Tile interactive={false}>
                    <div className="text-center py-6">
                        <div className="text-6xl mb-5" aria-hidden="true">
                            🛰️
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                            <span className="bg-linear-to-r from-(--accent-primary) via-(--accent-secondary) to-(--accent-tertiary) bg-clip-text text-transparent">
                                404: Off the Star Chart
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-(--text-secondary) max-w-md mx-auto leading-relaxed">
                            This page drifted out of orbit. No moon phase, no sunrise, no forecast
                            &mdash; just empty sky where a page used to be.
                        </p>

                        <Link
                            href="/"
                            data-testid="back-to-dashboard-button"
                            className="mt-8 inline-block px-6 py-3 rounded-xl bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) text-white font-semibold hover:shadow-lg transition-shadow duration-200"
                        >
                            <span aria-hidden="true">🌙</span> Back to the Dashboard
                        </Link>
                    </div>
                </Tile>
            </div>
        </main>
    );
};
