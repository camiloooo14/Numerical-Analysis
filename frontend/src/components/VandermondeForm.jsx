import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Desmos from "desmos";

const VandermondeForm = () => {
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ]);
  const [result, setResult] = useState(null);
  const graphRef = useRef(null);

  const handleChange = (index, axis, value) => {
    const newPoints = [...points];
    newPoints[index][axis] = parseFloat(value);
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const removePoint = (index) => {
    if (points.length > 2) {
      const newPoints = points.filter((_, i) => i !== index);
      setPoints(newPoints);
    } else {
      alert("Debe haber al menos dos puntos.");
    }
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

  useEffect(() => {
    if (result?.pol && graphRef.current) {
      const elt = graphRef.current;
      const calculator = Desmos.GraphingCalculator(elt, {
        expressions: false,
        settingsMenu: false,
        zoomButtons: true,
      });

   
      calculator.setExpression({
        id: "polynomial",
        latex: `f(x)=${result.pol}`,
        color: Desmos.Colors.BLUE,
      });

  
      points.forEach((p, i) => {
        calculator.setExpression({
          id: `point${i}`,
          latex: `(${p.x}, ${p.y})`,
          showLabel: true,
          label: `P_{${i + 1}}`,
          color: Desmos.Colors.RED,
        });
      });

      return () => calculator.destroy();
    }
  }, [result]);

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
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Calcular polinomio
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">Polinomio resultante:</h3>
          <p className="mt-2 text-blue-800 font-mono break-all">{result.pol}</p>

          <h4 className="mt-4 font-semibold">Coeficientes:</h4>
          <p>[{result.coefficients.map((c) => c.toFixed(4)).join(", ")}]</p>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Gráfico:</h4>
            <div ref={graphRef} style={{ height: "400px" }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VandermondeForm;
