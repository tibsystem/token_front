import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
);

const PropertyDetailSkeleton = () => {
  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-24" />
        <span className="text-gray-400">/</span>
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <Skeleton className="h-6 w-1/4 mb-8" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Gallery Skeleton */}
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-20 w-28 rounded" />
            <Skeleton className="h-20 w-28 rounded" />
            <Skeleton className="h-20 w-28 rounded" />
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* Details Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4 mb-4" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
            <div className="p-3 bg-gray-100 rounded-lg mt-3">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSkeleton;
