import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    animation?: 'pulse' | 'wave';
}

interface LoadingSkeletonProps {
    type: 'text' | 'avatar' | 'card' | 'button' | 'image' | 'list-item' | 'post-card' | 'journey-post' | 'map' | 'custom';
    lines?: number;
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    animation?: 'pulse' | 'wave';
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    rounded = 'md',
    animation = 'pulse'
}) => {
    const widthClass = typeof width === 'number' ? `w-${width}` : width;
    const heightClass = typeof height === 'number' ? `h-${height}` : height;

    return (
        <div
            className={`
        bg-gray-50 dark:bg-gray-200
        ${widthClass || 'w-full'}
        ${heightClass || 'h-4'}
        rounded-${rounded}
        ${animation === 'pulse' ? 'animate-pulse' : 'animate-pulse'}
        ${className}
      `}
        />
    );
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    type,
    lines = 3,
    className = '',
    width,
    height,
    rounded = 'md',
    animation = 'pulse'
}) => {
    const renderTextSkeleton = () => (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    width={index === lines - 1 ? '75%' : '100%'}
                    height={4}
                    rounded="sm"
                    animation={animation}
                />
            ))}
        </div>
    );

    const renderAvatarSkeleton = () => (
        <div className={`flex items-center space-x-3 ${className}`}>
            <Skeleton
                width={12}
                height={12}
                rounded="full"
                animation={animation}
            />
            <div className="flex-1 space-y-2">
                <Skeleton width="60%" height={4} rounded="sm" animation={animation} />
                <Skeleton width="40%" height={3} rounded="sm" animation={animation} />
            </div>
        </div>
    );

    const renderCardSkeleton = () => (
        <div className={`bg-white dark:bg-gray-50 rounded-lg p-4 shadow-sm ${className}`}>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <Skeleton width={10} height={10} rounded="full" animation={animation} />
                    <div className="flex-1">
                        <Skeleton width="40%" height={4} rounded="sm" animation={animation} />
                        <Skeleton width="60%" height={3} rounded="sm" animation={animation} />
                    </div>
                </div>
                <Skeleton width="100%" height={4} rounded="sm" animation={animation} />
                <Skeleton width="80%" height={4} rounded="sm" animation={animation} />
                <Skeleton width="60%" height={4} rounded="sm" animation={animation} />
            </div>
        </div>
    );

    const renderButtonSkeleton = () => (
        <Skeleton
            width={width || 'w-24'}
            height={height || 'h-10'}
            rounded={rounded}
            animation={animation}
            className={className}
        />
    );

    const renderImageSkeleton = () => (
        <Skeleton
            width={width || 'w-full'}
            height={height || 'h-48'}
            rounded={rounded}
            animation={animation}
            className={className}
        />
    );

    const renderListItemSkeleton = () => (
        <div className={`flex items-center space-x-3 p-3 ${className}`}>
            <Skeleton width={12} height={12} rounded="full" animation={animation} />
            <div className="flex-1 space-y-2">
                <Skeleton width="70%" height={4} rounded="sm" animation={animation} />
                <Skeleton width="50%" height={3} rounded="sm" animation={animation} />
            </div>
        </div>
    );

    const renderPostCardSkeleton = () => (
        <div className={`bg-white dark:bg-gray-50 rounded-lg shadow-sm ${className}`}>
            <div className="p-4">
                {/* Header - Profile Picture and User Info */}
                <div className="flex items-center space-x-3 mb-3">
                    {/* Profile Picture */}
                    <Skeleton width={10} height={10} rounded="full" animation={animation} />

                    {/* User Info */}
                    <div className="flex-1">
                        <Skeleton width="40%" height={4} rounded="sm" animation={animation} />
                        <Skeleton width="25%" height={3} rounded="sm" animation={animation} />
                    </div>
                </div>

                {/* Content Text */}
                <div className="space-y-2 mb-3">
                    <Skeleton width="100%" height={3} rounded="sm" animation={animation} />
                    <Skeleton width="90%" height={3} rounded="sm" animation={animation} />
                    <Skeleton width="75%" height={3} rounded="sm" animation={animation} />
                </div>

                {/* Media/Image */}
                <Skeleton width="100%" height={64} rounded="md" animation={animation} />

                {/* Engagement Bar */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-200">
                    <div className="flex items-center space-x-4">
                        <Skeleton width={6} height={3} rounded="sm" animation={animation} />
                        <Skeleton width={6} height={3} rounded="sm" animation={animation} />
                        <Skeleton width={6} height={3} rounded="sm" animation={animation} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJourneyPostSkeleton = () => (
        <div className={`bg-white dark:bg-gray-50 rounded-lg shadow-sm ${className}`}>
            <div className="p-4">
                {/* Header - Profile Picture and User Info */}
                <div className="flex items-center space-x-3 mb-3">
                    {/* Profile Picture */}
                    <Skeleton width={10} height={10} rounded="full" animation={animation} />

                    {/* User Info */}
                    <div className="flex-1">
                        <Skeleton width="40%" height={4} rounded="sm" animation={animation} />
                        <Skeleton width="25%" height={3} rounded="sm" animation={animation} />
                    </div>
                </div>

                {/* Journey Title */}
                <Skeleton width="60%" height={4} rounded="sm" animation={animation} className="mb-3" />

                {/* Map/Image */}
                <Skeleton width="100%" height={64} rounded="md" animation={animation} />

                {/* Journey Info */}
                <div className="mt-3 space-y-2">
                    <Skeleton width="80%" height={3} rounded="sm" animation={animation} />
                    <Skeleton width="60%" height={3} rounded="sm" animation={animation} />
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-200">
                    <div className="flex items-center space-x-4">
                        <Skeleton width={6} height={3} rounded="sm" animation={animation} />
                        <Skeleton width={6} height={3} rounded="sm" animation={animation} />
                        <Skeleton width={6} height={3} rounded="sm" animation={animation} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMapSkeleton = () => (
        <div className={`relative ${className}`}>
            <Skeleton
                width="100%"
                height={height || 'h-96'}
                rounded="lg"
                animation={animation}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-50 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2">
                        <Skeleton width={6} height={6} rounded="full" animation={animation} />
                        <Skeleton width={24} height={4} rounded="sm" animation={animation} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCustomSkeleton = () => (
        <Skeleton
            width={width}
            height={height}
            rounded={rounded}
            animation={animation}
            className={className}
        />
    );

    switch (type) {
        case 'text':
            return renderTextSkeleton();
        case 'avatar':
            return renderAvatarSkeleton();
        case 'card':
            return renderCardSkeleton();
        case 'button':
            return renderButtonSkeleton();
        case 'image':
            return renderImageSkeleton();
        case 'list-item':
            return renderListItemSkeleton();
        case 'post-card':
            return renderPostCardSkeleton();
        case 'journey-post':
            return renderJourneyPostSkeleton();
        case 'map':
            return renderMapSkeleton();
        case 'custom':
            return renderCustomSkeleton();
        default:
            return renderTextSkeleton();
    }
};

// Convenience components for common use cases
export const TextSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="text" {...props} />
);

export const AvatarSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="avatar" {...props} />
);

export const CardSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="card" {...props} />
);

export const ButtonSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="button" {...props} />
);

export const ImageSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="image" {...props} />
);

export const ListItemSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="list-item" {...props} />
);

export const PostCardSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="post-card" {...props} />
);

export const JourneyPostSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="journey-post" {...props} />
);

export const MapSkeleton: React.FC<Omit<LoadingSkeletonProps, 'type'>> = (props) => (
    <LoadingSkeleton type="map" {...props} />
);

export default LoadingSkeleton; 