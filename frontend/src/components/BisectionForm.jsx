import { useState } from "react";
import axios from "axios";
import "./BisectionForm.css";

export default function BisectionForm() {
  const [form, setForm] = useState({
    expression: "",
    a: "",
    b: "",
    tol: 0.0001,
    niter: 50,
    error_type: "absolute",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        a: parseFloat(form.a),
        b: parseFloat(form.b),
        tol: parseFloat(form.tol),
        niter: parseInt(form.niter, 10),
      };
      const response = await axios.post("http://127.0.0.1:8000/roots/bisection", formData);
      setResult(response.data);
    } catch (err) {
      setError("Error al calcular. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Método de Bisección
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700">Función (en x):</label>
          <input
            type="text"
            name="expression"
            value={form.expression}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700">a:</label>
            <input
              type="number"
              name="a"
              value={form.a}
              onChange={handleChange}
              className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">b:</label>
            <input
              type="number"
              name="b"
              value={form.b}
              onChange={handleChange}
              className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700">Tolerancia:</label>
            <input
              type="number"
              step="any"
              name="tol"
              value={form.tol}
              onChange={handleChange}
              className="border-2 border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">Iteraciones máximas:</label>
            <input
              type="number"
              name="niter"
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
          >
            <option value="absolute">Absoluto</option>
            <option value="relative">Relativo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white text-lg rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? "Calculando..." : "Calcular"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {result && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Resultado:</h3>
          <p className="text-lg">
            Raíz encontrada: <span className="font-semibold text-indigo-600">{result.root}</span>
          </p>

          <h4 className="text-lg font-semibold text-gray-700 mt-6">Tabla de Iteraciones:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto mt-2 text-sm">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-4 py-2 text-indigo-600">Iteración</th>
                  <th className="px-4 py-2 text-indigo-600">a</th>
                  <th className="px-4 py-2 text-indigo-600">b</th>
                  <th className="px-4 py-2 text-indigo-600">xm</th>
                  <th className="px-4 py-2 text-indigo-600">f(xm)</th>
                  <th className="px-4 py-2 text-indigo-600">Error</th>
                </tr>
              </thead>
              <tbody>
                {result.table.map((row, idx) => (
                  <tr key={idx} className="bg-white text-center border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{row.iteration}</td>
                    <td className="px-4 py-2">{row.a.toFixed(6)}</td>
                    <td className="px-4 py-2">{row.b.toFixed(6)}</td>
                    <td className="px-4 py-2">{row.xm.toFixed(6)}</td>
                    <td className="px-4 py-2">{row.f_xm.toExponential(3)}</td>
                    <td className="px-4 py-2">{row.error.toExponential(3)}</td>
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
