import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BisectionForm from './components/BisectionForm';
import FalseRuleForm from './components/FalseRuleForm';
import NewtonForm from './components/NewtonForm';
import FixedPointForm from './components/FixedPointForm';
import HelpPage from './components/HelpPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Proyecto de Análisis Numérico</h1>
          <nav className="mb-8">
            <ul className="flex justify-center gap-6">
              <li>
                <Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/help">
                  Sección de ayuda
                </Link>
              </li>
              <li>
                <Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/biseccion">
                  Método de Bisección
                </Link>
              </li>
              <li>
                <Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/regla-falsa">
                  Método de Regla Falsa
                </Link>
              </li>
              <li>
                <Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/newton">
                  Método de Newton
                </Link>
              </li>
              <li>
                <Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/fixed-point">
                  Método de Punto Fijo
                </Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/biseccion" element={<BisectionForm />} />
            <Route path="/regla-falsa" element={<FalseRuleForm />} />
            <Route path="/newton" element={<NewtonForm />} />
            <Route path="/fixed-point" element={<FixedPointForm />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
