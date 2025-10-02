import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <Card className={`h-[360px] ${className}`}>
      <CardContent className="p-0">
        {/* Image placeholder */}
        <div className="relative">
          <Skeleton className="w-full h-48 rounded-t-lg" />
          {/* Actions skeleton */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <Skeleton className="h-5 w-3/4" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Price and discount */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

interface ProductTableSkeletonProps {
  rows?: number;
  className?: string;
}

export function ProductTableSkeleton({
  rows = 5,
  className,
}: ProductTableSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table header */}
      <div className="grid grid-cols-6 gap-4 p-4 border-b">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-18" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-4 p-4 border-b border-border/50"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-md" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <div className="flex gap-1">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
