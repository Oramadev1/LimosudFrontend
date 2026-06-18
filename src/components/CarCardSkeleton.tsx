export default function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-[10px] p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-14 bg-gray-100 rounded" />
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded-full" />
      </div>
      <div className="w-full h-[120px] bg-gray-100 rounded-lg" />
      <div className="flex justify-between">
        <div className="h-3 w-10 bg-gray-100 rounded" />
        <div className="h-3 w-10 bg-gray-100 rounded" />
        <div className="h-3 w-10 bg-gray-100 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-14 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-24 bg-gray-200 rounded-[4px]" />
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </>
  );
}
