import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BisectionForm from './components/BisectionForm';
import FalseRuleForm from './components/FalseRuleForm';
import NewtonForm from './components/NewtonForm';
import FixedPointForm from './components/FixedPointForm';
import HelpPage from './components/HelpPage';
import SecanteForm from './components/SecanteForm';
import GaussSeidelForm from './components/GaussSeidelForm';
import SORForm from './components/SORForm';
import JacobiForm from './components/JacobiForm';
import LagrangeForm from './components/LagrangeForm';
import VandermondeForm from './components/VandermondeForm';
import SplineForm from './components/SplineForm';
import ComparisionLSM from './components/ComparisionLSM';
import RootComparison from './components/RootComparison';


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
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-700">Métodos de Root Finding</h2>
            <ul className="flex justify-center gap-6 mb-6">
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/biseccion">Método de Bisección</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/regla-falsa">Método de Regla Falsa</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/newton">Método de Newton</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/fixed-point">Método de Punto Fijo</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/Secant">Método de Secante</Link></li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-700">Métodos para Sistemas Lineales</h2>
            <ul className="flex justify-center gap-6 mb-6">
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/system-of-equations/gauss_seidel">Método de Gauss-Seidel</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/system-of-equations/sor">Método de SOR</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/system-of-equations/jacobi">Método de Jacobi</Link></li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-700">Métodos de Interpolación</h2>
            <ul className="flex justify-center gap-6">
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/system-of-equations/lagrange">Método de Lagrange</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/system-of-equations/Vandermonde">Método de Vandermonde</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/interpolation/splines">Método de Spline</Link></li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-700">Sección de comparación</h2>
            <ul className="flex justify-center gap-6">    
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/comparison/comparisonLSM">Comparación de métodos de sistemas lineales</Link></li>
              <li><Link className="text-indigo-500 hover:text-indigo-700 text-lg" to="/comparison/rootComparison">Comparación de métodos de raíces</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/help" element={<HelpPage />} />

            {/* Root Finding */}
            <Route path="/biseccion" element={<BisectionForm />} />
            <Route path="/regla-falsa" element={<FalseRuleForm />} />
            <Route path="/newton" element={<NewtonForm />} />
            <Route path="/fixed-point" element={<FixedPointForm />} />
            <Route path="/Secant" element={<SecanteForm />} />

            {/* Sistemas Lineales */}
            <Route path="/system-of-equations/gauss_seidel" element={<GaussSeidelForm />} />
            <Route path="/system-of-equations/sor" element={<SORForm />} />
            <Route path="/system-of-equations/jacobi" element={<JacobiForm />} />

            {/* Interpolación */}
            <Route path="/system-of-equations/lagrange" element={<LagrangeForm />} />
            <Route path="/system-of-equations/Vandermonde" element={<VandermondeForm />} />
            <Route path="/interpolation/splines" element={<SplineForm />} />

            {/* Comparación de métodos */}
            <Route path="/comparison/comparisonLSM" element={<ComparisionLSM />} />
            <Route path="/comparison/rootComparison" element={<RootComparison />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
