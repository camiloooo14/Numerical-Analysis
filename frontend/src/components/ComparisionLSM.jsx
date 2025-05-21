import React, { useState } from "react";
import axios from "axios";

function ComparisionLSM() {
  const [matrixA, setMatrixA] = useState("[[4,1],[2,3]]");
  const [vectorB, setVectorB] = useState("[1,2]");
  const [x0, setX0] = useState("[0,0]");
  const [tol, setTol] = useState(0.0001);
  const [niter, setNiter] = useState(100);
  const [relaxation, setRelaxation] = useState(1.1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/routers/roots/comparisonLSM", {
        matrix_a: JSON.parse(matrixA),
        vector_b: JSON.parse(vectorB),
        x0: JSON.parse(x0),
        tol: parseFloat(tol),
        niter: parseInt(niter),
        relaxation_factor: parseFloat(relaxation)
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
      <h1 className="text-3xl font-bold mb-4">Comparación de Métodos de sistemas lineales</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Matriz A (JSON):</label>
          <textarea
            value={matrixA}
            onChange={(e) => setMatrixA(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-semibold">Vector b (JSON):</label>
          <input
            value={vectorB}
            onChange={(e) => setVectorB(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Vector inicial x0 (JSON):</label>
          <input
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
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
          <div>
            <label className="block font-semibold">Factor de relajación ω:</label>
            <input
              type="number"
              step="any"
              value={relaxation}
              onChange={(e) => setRelaxation(e.target.value)}
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
                <th className="border px-4 py-2">Iteraciones</th>
                <th className="border px-4 py-2">Error Final</th>
                <th className="border px-4 py-2">Radio Espectral</th>
                <th className="border px-4 py-2">Converge</th>
                <th className="border px-4 py-2">Tiempo (ms)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{res.metodo}</td>
                  <td className="border px-4 py-2">{res.iteraciones}</td>
                  <td className="border px-4 py-2">{res.error_final.toExponential(2)}</td>
                  <td className="border px-4 py-2">{res.radio_espectral.toFixed(4)}</td>
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

export default ComparisionLSM;
