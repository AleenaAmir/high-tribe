import React from 'react';
import LoadingSkeleton, {
    TextSkeleton,
    AvatarSkeleton,
    CardSkeleton,
    ButtonSkeleton,
    ImageSkeleton,
    ListItemSkeleton,
    PostCardSkeleton,
    JourneyPostSkeleton,
    MapSkeleton
} from './LoadingSkeleton';

const LoadingSkeletonDemo: React.FC = () => {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold text-gray-400 dark:text-white mb-6">
                Loading Skeleton Components
            </h1>

            {/* Text Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Text Skeleton
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-400 mb-2">
                            Default (3 lines)
                        </h3>
                        <TextSkeleton />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-400 mb-2">
                            Custom (5 lines)
                        </h3>
                        <TextSkeleton lines={5} />
                    </div>
                </div>
            </div>

            {/* Avatar Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                    Avatar Skeleton
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AvatarSkeleton />
                    <AvatarSkeleton className="max-w-xs" />
                </div>
            </div>

            {/* Card Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Card Skeleton
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardSkeleton />
                    <CardSkeleton className="max-w-sm" />
                </div>
            </div>

            {/* Button Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Button Skeleton
                </h2>
                <div className="flex flex-wrap gap-4">
                    <ButtonSkeleton width="w-24" height="h-10" />
                    <ButtonSkeleton width="w-32" height="h-12" />
                    <ButtonSkeleton width="w-20" height="h-8" />
                </div>
            </div>

            {/* Image Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Image Skeleton
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ImageSkeleton height="h-32" />
                    <ImageSkeleton height="h-48" />
                    <ImageSkeleton height="h-64" />
                </div>
            </div>

            {/* List Item Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    List Item Skeleton
                </h2>
                <div className="space-y-2 max-w-md">
                    <ListItemSkeleton />
                    <ListItemSkeleton />
                    <ListItemSkeleton />
                </div>
            </div>

            {/* Post Card Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Post Card Skeleton
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PostCardSkeleton />
                    <PostCardSkeleton />
                </div>
            </div>

            {/* Journey Post Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Journey Post Skeleton (Map Posts)
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    <JourneyPostSkeleton />
                    <JourneyPostSkeleton />
                </div>
            </div>

            {/* Map Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Map Skeleton
                </h2>
                <MapSkeleton height="h-80" />
            </div>

            {/* Custom Skeleton */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Custom Skeleton
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LoadingSkeleton
                        type="custom"
                        width="w-full"
                        height="h-20"
                        rounded="lg"
                        className="bg-gradient-to-r from-blue-200 to-purple-200"
                    />
                    <LoadingSkeleton
                        type="custom"
                        width="w-full"
                        height="h-20"
                        rounded="full"
                        className="bg-gradient-to-r from-green-200 to-blue-200"
                    />
                    <LoadingSkeleton
                        type="custom"
                        width="w-full"
                        height="h-20"
                        rounded="none"
                        className="bg-gradient-to-r from-orange-200 to-red-200"
                    />
                </div>
            </div>

            {/* Animation Types */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-300">
                    Animation Types
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Pulse Animation (Default)
                        </h3>
                        <TextSkeleton animation="pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Wave Animation
                        </h3>
                        <TextSkeleton animation="wave" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeletonDemo; 