import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

export const ServiceCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  </div>
);

export const BookingCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <Skeleton className="h-5 w-48" />
    <div className="flex gap-4">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 6 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-16" />
  </div>
);

export default Skeleton;
