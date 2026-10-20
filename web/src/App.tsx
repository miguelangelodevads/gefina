import { BrowserRouter, Link, Route, Routes } from 'react-router';

import DashboardPage from './DashboardPage.tsx';
import InvoicePage from './InvoicePage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Painel Inicial</Link>
        <Link to="/faturas">Faturas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/faturas" element={<InvoicePage />} />
      </Routes>
    </BrowserRouter>
  );
}
