import { VehicleGridSkeleton } from '@/components/ui/VehicleSkeleton'

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <section className="bg-gradient-to-br from-[#161b39] via-[#1d2447] to-[#802223] py-16 sm:py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl text-center mx-auto space-y-4">
                        <div className="h-10 sm:h-16 bg-white/10 rounded-lg animate-pulse w-3/4 mx-auto" />
                        <div className="h-6 sm:h-8 bg-white/10 rounded-lg animate-pulse w-1/2 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Grid Skeleton */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-3 sm:px-6">
                    <div className="mb-8 h-16 bg-gray-100 rounded-lg animate-pulse" />
                    <VehicleGridSkeleton count={9} />
                </div>
            </section>
        </div>
    )
}
