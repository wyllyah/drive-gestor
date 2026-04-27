import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <Sidebar />
      <div className="min-h-screen lg:pl-72">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
