import React, { useState, useEffect } from "react";
import axios from "axios";

const GaussSeidelForm = () => {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState([]);
  const [vectorB, setVectorB] = useState([]);
  const [x0, setX0] = useState([]);
  const [tol, setTol] = useState(0.0001);
  const [niter, setNiter] = useState(25);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setMatrixA(Array.from({ length: size }, () => Array(size).fill(0)));
    setVectorB(Array(size).fill(0));
    setX0(Array(size).fill(0));
    setResult(null);
  }, [size]);

  const handleInputChange = (setter, row, col = null) => (e) => {
    const value = parseFloat(e.target.value);
    setter((prev) => {
      const copy = [...prev];
      if (col === null) {
        copy[row] = value;
      } else {
        copy[row][col] = value;
      }
      return copy;
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/system-of-equations/gauss-seidel", {
        matrix_a: matrixA,
        vector_b: vectorB,
        x0,
        tol,
        niter,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al enviar los datos al backend.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Método de Gauss-Seidel</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Tamaño de la matriz</label>
        <select
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="px-2 py-1 border rounded"
        >
          {[2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} x {n}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Matriz A</label>
        {matrixA.map((row, i) => (
          <div key={i} className="flex gap-2 mb-1">
            {row.map((val, j) => (
              <input
                key={j}
                type="number"
                value={matrixA[i][j]}
                onChange={handleInputChange(setMatrixA, i, j)}
                style={{ width: "30px", padding: "2px", fontSize: "12px", textAlign: "center" }}
                className="border rounded"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Vector b</label>
        <div className="flex gap-2">
          {vectorB.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={handleInputChange(setVectorB, i)}
              style={{ width: "30px", padding: "2px", fontSize: "12px", textAlign: "center" }}
              className="border rounded"
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Vector x₀</label>
        <div className="flex gap-2">
          {x0.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={handleInputChange(setX0, i)}
              style={{ width: "30px", padding: "2px", fontSize: "12px", textAlign: "center" }}
              className="border rounded"
            />
          ))}
        </div>
      </div>

      <div className="mb-4 flex gap-4 flex-wrap">
        <div>
          <label className="block font-semibold mb-1">Tolerancia</label>
          <input
            type="number"
            value={tol}
            onChange={(e) => setTol(parseFloat(e.target.value))}
            className="w-32 px-2 py-1 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Iteraciones máximas</label>
          <input
            type="number"
            value={niter}
            onChange={(e) => setNiter(parseInt(e.target.value))}
            className="w-32 px-2 py-1 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ejecutar Gauss-Seidel
      </button>

      {result && (
        <div className="mt-6">
          <p>
            <strong>Radio espectral:</strong> {result.spectral_radius.toFixed(6)}
          </p>
          <p>
            <strong>¿Converge?</strong> {result.converges ? "Sí" : "No"}
          </p>

          <h3 className="mt-4 font-semibold">Iteraciones:</h3>
          <ul className="list-disc pl-5 mt-2">
            {result.iterations.map((iter) => (
              <li key={iter.step}>
                Paso {iter.step}: x = [{iter.x.map((v) => v.toFixed(4)).join(", ")}], error = {iter.error.toExponential(3)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GaussSeidelForm;
