import React, { useState } from "react";
import axios from "axios";

function InterpolationComparison() {
  const [x, setX] = useState("0,1,2");
  const [y, setY] = useState("1,2,4");
  const [grado, setGrado] = useState(2);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Convertir las cadenas de x,y en arrays de números
      const xArray = x.split(',').map(num => parseFloat(num.trim()));
      const yArray = y.split(',').map(num => parseFloat(num.trim()));

      // Validar que x e y tengan la misma longitud
      if (xArray.length !== yArray.length) {
        throw new Error("Los arrays X e Y deben tener la misma longitud");
      }

      const response = await axios.post("http://localhost:8000/comparisonInterpolation/comparisonInterpolation", {
        x: xArray,
        y: yArray,
        grado: parseInt(grado)
      });
      setResults(response.data);
    } catch (err) {
      setError(err.message || "Error al realizar la petición. Revisa los datos ingresados o el servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Comparación de Métodos de Interpolación</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Puntos X (separados por comas):</label>
          <input
            value={x}
            onChange={(e) => setX(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ejemplo: 0,1,2"
          />
        </div>
        <div>
          <label className="block font-semibold">Puntos Y (separados por comas):</label>
          <input
            value={y}
            onChange={(e) => setY(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ejemplo: 1,2,4"
          />
        </div>
        <div>
          <label className="block font-semibold">Grado (para Splines):</label>
          <input
            type="number"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            className="w-full border p-2 rounded"
            min="1"
          />
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
          <div className="overflow-x-auto">
            <table className="min-w-full border bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Método</th>
                  <th className="border px-4 py-2">Polinomio</th>
                  <th className="border px-4 py-2">Tiempo (ms)</th>
                  {results.some(r => r.grado !== null) && (
                    <th className="border px-4 py-2">Grado</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((res, i) => (
                  <tr key={i} className="text-center">
                    <td className="border px-4 py-2">{res.metodo}</td>
                    <td className="border px-4 py-2 max-w-md overflow-x-auto">
                      <div className="whitespace-normal break-words">
                        {res.polinomio}
                      </div>
                    </td>
                    <td className="border px-4 py-2">{res.tiempo_ms.toFixed(2)}</td>
                    {results.some(r => r.grado !== null) && (
                      <td className="border px-4 py-2">{res.grado || "-"}</td>
                    )}
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

export default InterpolationComparison; 