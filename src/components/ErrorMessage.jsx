import { AlertCircle, RotateCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <RotateCw size={16} aria-hidden="true" />
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
