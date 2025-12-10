'use client'

import { motion } from 'framer-motion'

export function VehicleSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="relative h-48 sm:h-56 bg-gray-200 animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-grow space-y-3">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />

                {/* Price */}
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Button */}
                <div className="mt-auto pt-4">
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
                </div>
            </div>
        </div>
    )
}

export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                    <VehicleSkeleton />
                </motion.div>
            ))}
        </div>
    )
}
