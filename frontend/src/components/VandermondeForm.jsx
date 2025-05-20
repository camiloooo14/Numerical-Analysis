import React, { useState } from "react";
import axios from "axios";

const VandermondeForm = () => {
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ]);
  const [result, setResult] = useState(null);

  const handleChange = (index, axis, value) => {
    const newPoints = [...points];
    newPoints[index][axis] = parseFloat(value);
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const removePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/interpolation/Vandermonde", {
        x: points.map((p) => p.x),
        y: points.map((p) => p.y),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al enviar los datos al backend.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Interpolación de Vandermonde</h2>

      {points.map((point, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <label>Punto {i + 1}:</label>
          <input
            type="number"
            value={point.x}
            onChange={(e) => handleChange(i, "x", e.target.value)}
            className="w-24 px-2 py-1 border rounded"
          />
          <input
            type="number"
            value={point.y}
            onChange={(e) => handleChange(i, "y", e.target.value)}
            className="w-24 px-2 py-1 border rounded"
          />
          <button
            onClick={() => removePoint(i)}
            disabled={points.length <= 2}
            className="text-sm text-red-600 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      ))}

      <div className="mb-4 flex gap-4">
        <button onClick={addPoint} className="bg-gray-200 px-3 py-1 rounded">
          Agregar punto
        </button>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Calcular polinomio
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">Polinomio resultante:</h3>
          <p className="mt-2 text-blue-800 font-mono break-all">{result.pol}</p>

          <h4 className="mt-4 font-semibold">Coeficientes:</h4>
          <p>[{result.coefficients.map((c) => c.toFixed(4)).join(", ")}]</p>
        </div>
      )}
    </div>
  );
};

export default VandermondeForm;
