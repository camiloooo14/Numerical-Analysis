import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Desmos from "desmos";

const LagrangeForm = () => {
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [result, setResult] = useState(null);
  const desmosRef = useRef(null);
  const calculatorRef = useRef(null);

  const handlePointChange = (index, axis) => (e) => {
    const value = parseFloat(e.target.value);
    setPoints((prev) => {
      const copy = [...prev];
      copy[index][axis] = value;
      return copy;
    });
  };

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0 }]);
  };

  const removePoint = (index) => {
    if (points.length > 2) {
      setPoints(points.filter((_, i) => i !== index));
    } else {
      alert("Debe haber al menos dos puntos.");
    }
  };

  const handleSubmit = async () => {
    try {
      const x = points.map((p) => p.x);
      const y = points.map((p) => p.y);
      const res = await axios.post("http://localhost:8000/interpolation/lagrange", {
        x,
        y,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al enviar los datos al backend.");
    }
  };

  useEffect(() => {
    if (result?.pol && desmosRef.current) {
      if (!calculatorRef.current) {
        calculatorRef.current = Desmos.GraphingCalculator(desmosRef.current, {
          expressions: true,
          keypad: false,
        });
      }

      const expression = result.pol.replaceAll("^", "**"); // Desmos acepta "^" pero por si acaso
      calculatorRef.current.setExpression({ id: "poly", latex: `y=${expression}` });

      points.forEach((point, index) => {
        calculatorRef.current.setExpression({
          id: `point${index}`,
          latex: `(${point.x}, ${point.y})`,
          showLabel: true,
          label: `P${index + 1}`,
        });
      });
    }
  }, [result]);

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Interpolación de Lagrange</h2>

      <div className="mb-4 space-y-2">
        {points.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <label className="font-semibold">Punto {index + 1}:</label>
            <input
              type="number"
              value={point.x}
              onChange={handlePointChange(index, "x")}
              placeholder="x"
              className="w-24 px-2 py-1 border rounded"
            />
            <input
              type="number"
              value={point.y}
              onChange={handlePointChange(index, "y")}
              placeholder="y"
              className="w-24 px-2 py-1 border rounded"
            />
            <button
              onClick={() => removePoint(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={points.length <= 2}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={addPoint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar punto
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Calcular polinomio
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Polinomios base:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {result.polys.map((poly, i) => (
              <li key={i}>
                L{i}(x) = {poly}
              </li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">Polinomio resultante:</h3>
          <p className="mt-2 bg-gray-100 p-3 rounded font-mono">{result.pol}</p>

          {/* Contenedor de la gráfica */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Gráfica del polinomio:</h3>
            <div ref={desmosRef} style={{ height: "400px" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LagrangeForm;
