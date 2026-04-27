const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-100 disabled:bg-blue-300 disabled:cursor-not-allowed",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 focus:ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed",
  danger:
    "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 focus:ring-rose-100 disabled:opacity-60 disabled:cursor-not-allowed",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
