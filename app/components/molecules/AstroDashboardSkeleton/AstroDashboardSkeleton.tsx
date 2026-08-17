export const AstroDashboardSkeleton = () => {
    return (
        <section
            aria-label="Loading astronomy data"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="rounded-2xl border border-(--card-border) bg-(--card-background) p-8 min-h-64 animate-pulse">
                <div className="h-5 w-32 rounded bg-(--card-border) mb-8" />
                <div className="h-10 w-40 rounded bg-(--card-border) mx-auto mb-6" />

                <div className="space-y-3">
                    <div className="h-4 rounded bg-(--card-border)" />
                    <div className="h-4 rounded bg-(--card-border)" />
                    <div className="h-4 rounded bg-(--card-border)" />
                </div>
            </div>

            <div className="rounded-2xl border border-(--card-border) bg-(--card-background) p-8 min-h-64 animate-pulse">
                <div className="h-5 w-24 rounded bg-(--card-border) mb-8" />

                <div className="space-y-5">
                    <div className="h-14 rounded bg-(--card-border)" />
                    <div className="h-14 rounded bg-(--card-border)" />
                    <div className="h-14 rounded bg-(--card-border)" />
                </div>
            </div>

            <div className="md:col-span-2 rounded-2xl border border-(--card-border) bg-(--card-background) p-8 min-h-48 animate-pulse">
                <div className="h-5 w-28 rounded bg-(--card-border) mb-8" />

                <div className="space-y-4">
                    <div className="h-8 rounded bg-(--card-border)" />
                    <div className="h-8 rounded bg-(--card-border)" />
                    <div className="h-8 rounded bg-(--card-border)" />
                </div>
            </div>
        </section>
    );
};
