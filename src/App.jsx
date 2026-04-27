import AppRoutes from './routes/AppRoutes.jsx';
import { useLocation } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/cadastro';

  if (isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}
