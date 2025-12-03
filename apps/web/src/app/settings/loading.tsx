export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
        <p className="text-slate-400 text-sm">Loading settings...</p>
      </div>
    </div>
  );
}

