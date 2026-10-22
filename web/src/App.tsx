import { BrowserRouter, Link, Route, Routes } from 'react-router';

import DashboardPage from './DashboardPage.tsx';
import InvoicePage from './InvoicePage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <aside>
        <header>Gefina</header>

        <nav>
          <ul>
            <li>
              <Link to="/">Painel Inicial</Link>
            </li>
            <li>
              <Link to="/faturas">Faturas</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/faturas" element={<InvoicePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
