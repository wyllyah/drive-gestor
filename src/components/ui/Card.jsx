export default function Card({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component className={`rounded-xl border border-slate-200 bg-white shadow-soft ${className}`} {...props}>
      {children}
    </Component>
  );
}
