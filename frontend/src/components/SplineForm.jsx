import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Desmos from "desmos";

const SplineForm = () => {
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ]);
  const [splineType, setSplineType] = useState("linear");
  const [result, setResult] = useState(null);
  const calculatorRef = useRef(null);

  const handleChange = (index, axis, value) => {
    const parsedValue = value === "" ? "" : parseFloat(value);
    const newPoints = [...points];
    newPoints[index][axis] = parsedValue;
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
    if (points.some((p) => isNaN(p.x) || isNaN(p.y))) {
      alert("Por favor, ingresa todos los valores numéricos válidos.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/interpolation/splines", {
        x: points.map((p) => p.x),
        y: points.map((p) => p.y),
        d: splineType,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al enviar los datos al backend.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !result || !points || points.length < 2) return;

    if (!calculatorRef.current) {
      const elt = document.getElementById("spline-graph");
      if (elt) {
        calculatorRef.current = Desmos.GraphingCalculator(elt, {
          expressions: false,
        });
        console.log("Desmos calculator initialized");
      }
    }

    const calculator = calculatorRef.current;
    if (!calculator) return;

    calculator.resize();
    calculator.setBlank();

    // Mostrar puntos
    points.forEach((p, i) => {
      calculator.setExpression({
        id: `point-${i}`,
        latex: `(${p.x}, ${p.y})`,
        showLabel: true,
        color: "#e17055",
      });
    });

    // Mostrar splines
    const coef = result.coefficients;
    for (let i = 0; i < coef.length && i + 1 < points.length; i++) {
      const [a, b, c = 0, d = 0] = coef[i];
      const xi = points[i].x;
      const xi1 = points[i + 1].x;

      let expr = "";

      if (splineType === "linear") {
        expr = `${a.toFixed(4)} + ${b.toFixed(4)}(x - ${xi})`;
      } else if (splineType === "quadratic") {
        expr = `${a.toFixed(4)} + ${b.toFixed(4)}(x - ${xi}) + ${c.toFixed(4)}(x - ${xi})^2`;
      } else if (splineType === "cubic") {
        expr = `${a.toFixed(4)} + ${b.toFixed(4)}(x - ${xi}) + ${c.toFixed(4)}(x - ${xi})^2 + ${d.toFixed(4)}(x - ${xi})^3`;
      }

      calculator.setExpression({
        id: `spline-${i}`,
        latex: `y=${expr}\\{${xi} \\le x \\le ${xi1}\\}`,
        color: "#2e86de",
      });
    }
  }, [result, splineType, points]);

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Interpolación por Splines</h2>

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

      <div className="mb-4">
        <label className="mr-2 font-medium">Tipo de spline:</label>
        <select
          value={splineType}
          onChange={(e) => setSplineType(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="linear">Lineal</option>
          <option value="quadratic">Cuadrático</option>
          <option value="cubic">Cúbico</option>
        </select>
      </div>

      <div className="mb-4 flex gap-4">
        <button onClick={addPoint} className="bg-gray-200 px-3 py-1 rounded">
          Agregar punto
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Calcular spline
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Coeficientes por intervalo:</h3>
          <div className="space-y-2 font-mono text-blue-800">
            {result.coefficients.map((coef, i) => (
              <div key={i}>
                Intervalo {i + 1}: [{coef.map((c) => c.toFixed(4)).join(", ")}]
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        id="spline-graph"
        style={{ width: "100%", height: "400px", border: "1px solid #ccc", marginTop: "2rem" }}
      />
    </div>
  );
};

export default SplineForm;
