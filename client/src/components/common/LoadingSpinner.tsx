export function LoadingSpinner({ message = 'Laden...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-wm-green border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-500 text-sm">{message}</span>
    </div>
  );
}
