import { useState } from "react";

const NewtonForm = ({ onSubmit }) => {
  const [expression, setExpression] = useState("x**3 - x - 2");
  const [x0, setX0] = useState(1.5);
  const [tol, setTol] = useState(1e-7);
  const [niter, setNiter] = useState(50);
  const [errorType, setErrorType] = useState("absolute");
  const [multipleRoots, setMultipleRoots] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      expression,
      x0,
      tol,
      niter,
      error_type: errorType,
      multiple_roots: multipleRoots,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block font-medium">Función (en Python):</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="Ej: x**3 - x - 2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">x₀ (valor inicial):</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="w-full border px-2 py-1 rounded"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Tolerancia:</label>
          <input
            type="number"
            value={tol}
            onChange={(e) => setTol(parseFloat(e.target.value))}
            className="w-full border px-2 py-1 rounded"
            step="any"
            min="1e-21"
            max="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Máx. iteraciones:</label>
          <input
            type="number"
            value={niter}
            onChange={(e) => setNiter(parseInt(e.target.value))}
            className="w-full border px-2 py-1 rounded"
            min="1"
            max="100"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Tipo de error:</label>
          <select
            value={errorType}
            onChange={(e) => setErrorType(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="absolute">Absoluto</option>
            <option value="relative">Relativo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={multipleRoots}
            onChange={(e) => setMultipleRoots(e.target.checked)}
          />
          ¿Múltiples raíces?
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Calcular raíz
      </button>
    </form>
  );
};

export default NewtonForm;
