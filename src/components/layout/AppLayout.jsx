import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <div className="min-h-screen lg:pl-72">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
