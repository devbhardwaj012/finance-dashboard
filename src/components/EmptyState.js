export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center
                    h-[calc(100vh-80px)] px-4">
      {/* Icon placeholder */}
      <div className="mb-4 text-slate-400 dark:text-slate-500 text-4xl">
        📊
      </div>

      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Build Your Finance Dashboard
      </h2>

      <p className="mt-2 max-w-xl text-slate-500">
        Create custom widgets by connecting to any finance API. Track stocks,
        crypto, forex, or economic indicators — all in real time.
      </p>
    </div>
  );
}
