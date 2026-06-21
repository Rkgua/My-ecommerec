export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-12 mb-12">
        <div className="h-12 w-48 bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-3 w-full bg-muted animate-pulse rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                <div className="h-7 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
