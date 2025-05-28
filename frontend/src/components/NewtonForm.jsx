import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Desmos from 'desmos';

export default function NewtonForm() {
  const [form, setForm] = useState({
    expression: '',
    df_expr: '',
    x0: '',
    tol: '0.0001',
    niter: '100',
    error_type: 'absolute'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculatorRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const formData = {
        ...form,
        x0: parseFloat(form.x0),
        tol: parseFloat(form.tol),
        niter: parseInt(form.niter, 10),
      };
      const response = await axios.post("http://127.0.0.1:8000/roots/newton", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!calculatorRef.current) {
      calculatorRef.current = Desmos.GraphingCalculator(document.getElementById('desmos-graph'), {
        expressions: true,
        settingsMenu: false,
        zoomButtons: true,
        expressionsTopbar: false
      });
    }

    if (calculatorRef.current && form.expression) {
      calculatorRef.current.setExpression({ id: 'graph1', latex: `y=${form.expression}` });
    }
  }, [form.expression]);

  useEffect(() => {
    if (calculatorRef.current && result?.table && Array.isArray(result.table)) {
      calculatorRef.current.setExpressions([
        { id: 'graph1', latex: `y=${form.expression}` },
        ...result.table.map((row, index) => ({
          id: `point${index}`,
          latex: `\\left(${row.x}, ${row.fx}\\right)`,
          showLabel: true,
          label: `x${index}`,
          color: Desmos.Colors.RED
        }))
      ]);
    }
  }, [result, form.expression]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Método de Newton</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700">Función f(x):</label>
          <input
            type="text"
            name="expression"
            placeholder="x^2 - 4"
            value={form.expression}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">Derivada f'(x):</label>
          <input
            type="text"
            name="df_expr"
            placeholder="2*x"
            value={form.df_expr}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">Valor inicial (x₀):</label>
          <input
            type="number"
            name="x0"
            value={form.x0}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700">Tolerancia:</label>
            <input
              type="number"
              name="tol"
              step="any"
              min="0.000000000000000000001"
              max="1"
              value={form.tol}
              onChange={handleChange}
              className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">Número de iteraciones:</label>
            <input
              type="number"
              name="niter"
              min="1"
              max="100"
              value={form.niter}
              onChange={handleChange}
              className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">Tipo de error:</label>
          <select
            name="error_type"
            value={form.error_type}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="absolute">Absoluto</option>
            <option value="relative">Relativo</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white text-lg rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      <div id="desmos-graph" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {result && result.table && Array.isArray(result.table) && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Resultados:</h3>
          <p className="text-lg">
            Raíz encontrada: <span className="font-semibold text-indigo-600">{result.root}</span>
          </p>

          <h4 className="text-lg font-semibold text-gray-700 mt-6">Tabla de Iteraciones:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto mt-2 text-sm">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-4 py-2 text-indigo-600">Iteración</th>
                  <th className="px-4 py-2 text-indigo-600">x</th>
                  <th className="px-4 py-2 text-indigo-600">f(x)</th>
                  <th className="px-4 py-2 text-indigo-600">f'(x)</th>
                  <th className="px-4 py-2 text-indigo-600">Error</th>
                </tr>
              </thead>
              <tbody>
                {result.table.map((row, index) => (
                  <tr key={index} className="bg-white text-center border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{row.iteration}</td>
                    <td className="px-4 py-2">{row.x}</td>
                    <td className="px-4 py-2">{row.fx}</td>
                    <td className="px-4 py-2">{row.dfx}</td>
                    <td className="px-4 py-2">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
