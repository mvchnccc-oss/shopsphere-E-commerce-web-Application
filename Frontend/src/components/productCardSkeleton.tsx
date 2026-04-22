import { Skeleton } from "./ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
        <Skeleton className="size-75" />
      </div>

      <div className="flex flex-1 flex-col p-3 gap-1">
        <Skeleton className="h-5" />
        <Skeleton className="h-3.75 w-40" />
        <Skeleton className="h-7 w-30" />
      </div>

      <div className="mt-auto px-3 pb-3 ">
        <Skeleton className="w-full h-8 rounded-lg" />
      </div>
    </div>
  );
}
