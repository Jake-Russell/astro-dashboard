"use client";

const shimmerKeyframes = `
@keyframes astro-skeleton-shimmer {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
    <div className={`relative overflow-hidden rounded bg-(--card-border) ${className}`}>
        <div
            className="absolute inset-0 animate-[astro-skeleton-shimmer_1.6s_ease-in-out_infinite] bg-linear-to-r from-transparent via-(--card-bg)/60 to-transparent"
            aria-hidden="true"
        />
    </div>
);

const SkeletonRow = () => (
    <div className="flex items-center justify-between p-3 rounded-lg">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-4 w-16" />
    </div>
);

export const AstroDashboardSkeleton = () => {
    return (
        <>
            <style>{shimmerKeyframes}</style>

            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Moon Phase */}
                    <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-8">
                        <SkeletonBlock className="h-5 w-28 mb-8" />

                        <div className="space-y-6">
                            <div className="text-center space-y-3">
                                <SkeletonBlock className="h-8 w-32 mx-auto" />

                                <div className="flex items-center justify-center gap-8 my-2">
                                    <SkeletonBlock className="h-20 w-20 rounded-full" />
                                    <div className="text-center space-y-2">
                                        <SkeletonBlock className="h-9 w-16 mx-auto" />
                                        <SkeletonBlock className="h-3 w-20 mx-auto" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-(--card-border)">
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </div>
                        </div>
                    </div>

                    {/* Sun */}
                    <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-8">
                        <SkeletonBlock className="h-5 w-12 mb-8" />

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <SkeletonBlock className="h-16 w-full rounded-lg" />
                                <SkeletonBlock className="h-16 w-full rounded-lg" />
                                <SkeletonBlock className="h-16 w-full rounded-lg" />
                            </div>

                            <div className="pt-4 border-t border-(--card-border)">
                                <SkeletonRow />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weather */}
                <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-8">
                    <SkeletonBlock className="h-5 w-20 mb-8" />

                    <div className="space-y-2 mb-4">
                        <SkeletonBlock className="h-3 w-48" />
                        <SkeletonBlock className="h-3 w-64" />
                    </div>

                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-1">
                                <SkeletonBlock className="h-4 w-14" />
                                <SkeletonBlock className="h-4 w-24" />
                                <SkeletonBlock className="h-4 w-10" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Star Grade */}
                <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-8">
                    <SkeletonBlock className="h-5 w-24 mb-8" />

                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <SkeletonBlock className="h-7 w-32 mx-auto" />
                            <SkeletonBlock className="h-4 w-56 mx-auto" />
                        </div>

                        <div className="flex items-center justify-center mb-2">
                            <div className="text-center space-y-1">
                                <SkeletonBlock className="h-12 w-16 mx-auto" />
                                <SkeletonBlock className="h-3 w-20 mx-auto" />
                            </div>
                        </div>

                        <SkeletonBlock className="h-4 w-2/3 mx-auto" />

                        <div className="p-4 rounded-lg bg-(--card-bg) border border-(--card-border) space-y-4">
                            <div className="flex justify-between items-center">
                                <SkeletonBlock className="h-3 w-24" />
                                <SkeletonBlock className="h-3 w-12" />
                            </div>
                            <SkeletonBlock className="h-2 w-full rounded" />
                            <div className="flex justify-between items-center">
                                <SkeletonBlock className="h-3 w-24" />
                                <SkeletonBlock className="h-3 w-12" />
                            </div>
                            <SkeletonBlock className="h-2 w-full rounded" />
                        </div>

                        <SkeletonBlock className="h-20 w-full rounded-lg" />

                        <div className="space-y-3 border-t border-(--card-border) pt-4">
                            <SkeletonBlock className="h-16 w-full rounded-lg" />
                            <SkeletonBlock className="h-16 w-full rounded-lg" />
                        </div>

                        <SkeletonBlock className="h-16 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </>
    );
};
