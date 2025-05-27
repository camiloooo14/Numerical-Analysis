import React, { useState } from "react";
import axios from "axios";

function RootComparison() {
  const [fx, setFx] = useState("x^2 - 4");
  const [dfx, setDfx] = useState("2*x");
  const [g, setG] = useState("sqrt(4)");
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(3);
  const [tol, setTol] = useState(0.0001);
  const [niter, setNiter] = useState(100);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/comparisonRoot/comparisonRootFinding", {
        fx: fx,
        dfx: dfx,
        g: g,
        x0: parseFloat(x0),
        x1: parseFloat(x1),
        tol: parseFloat(tol),
        niter: parseInt(niter)
      });
      setResults(response.data);
    } catch (err) {
      setError("Error al realizar la petición. Revisa los datos ingresados o el servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Comparación de Métodos de Raíces</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Función f(x):</label>
          <input
            value={fx}
            onChange={(e) => setFx(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ejemplo: x^2 - 4"
          />
        </div>
        <div>
          <label className="block font-semibold">Derivada f'(x) (para Newton):</label>
          <input
            value={dfx}
            onChange={(e) => setDfx(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ejemplo: 2*x"
          />
        </div>
        <div>
          <label className="block font-semibold">Función g(x) (para Punto Fijo):</label>
          <input
            value={g}
            onChange={(e) => setG(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ejemplo: sqrt(4)"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold">x0:</label>
            <input
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">x1:</label>
            <input
              type="number"
              step="any"
              value={x1}
              onChange={(e) => setX1(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Tolerancia:</label>
            <input
              type="number"
              step="any"
              value={tol}
              onChange={(e) => setTol(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Iteraciones máximas:</label>
            <input
              type="number"
              value={niter}
              onChange={(e) => setNiter(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Calculando..." : "Comparar"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Resultados:</h2>
          <table className="min-w-full border bg-white rounded shadow">
            <thead>
              <tr>
                <th className="border px-4 py-2">Método</th>
                <th className="border px-4 py-2">Raíz</th>
                <th className="border px-4 py-2">Iteraciones</th>
                <th className="border px-4 py-2">Error</th>
                <th className="border px-4 py-2">Converge</th>
                <th className="border px-4 py-2">Tiempo (ms)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{res.metodo}</td>
                  <td className="border px-4 py-2">{res.raiz.toFixed(6)}</td>
                  <td className="border px-4 py-2">{res.iteraciones}</td>
                  <td className="border px-4 py-2">{res.error.toExponential(2)}</td>
                  <td className="border px-4 py-2">{res.converge ? "Sí" : "No"}</td>
                  <td className="border px-4 py-2">{res.tiempo_ms.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RootComparison; 