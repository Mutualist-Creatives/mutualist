export default function Loading() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}
