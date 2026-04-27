import { Navigate, Route, Routes } from 'react-router-dom';
import Carros from '../pages/Carros.jsx';
import Clientes from '../pages/Clientes.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Pagamentos from '../pages/Pagamentos.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/carros" element={<Carros />} />
      <Route path="/pagamentos" element={<Pagamentos />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
