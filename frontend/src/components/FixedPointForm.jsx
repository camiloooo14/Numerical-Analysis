import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Desmos from 'desmos';

export default function FixedPointForm() {
  const [form, setForm] = useState({
    f_expr: '',
    g_expr: '',
    x0: '',
    tol: '0.0001',
    niter: '100',
    error_type: 'absolute'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculatorRef = useRef(null);

  // Handle form changes
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
        x0: parseFloat(form.x0),
        tol: parseFloat(form.tol),
        niter: parseInt(form.niter, 10)
      };

      const response = await axios.post("http://127.0.0.1:8000/roots/fixed_point", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!calculatorRef.current) {
      calculatorRef.current = Desmos.GraphingCalculator(document.getElementById('desmos-graph'), {
        expressions: true,
        settingsMenu: false,
        zoomButtons: true,
        expressionsTopbar: false
      });
    }

    if (calculatorRef.current && form.f_expr && form.g_expr) {
      calculatorRef.current.setExpression({ id: 'f_expr', latex: `y=${form.f_expr}` });
      calculatorRef.current.setExpression({ id: 'g_expr', latex: `y=${form.g_expr}` });
    }
  }, [form.f_expr, form.g_expr]);

  return (
    <div className="frf-container">
      <div className="frf-card">
        <h2 className="frf-title">Método de Punto Fijo</h2>
        <form onSubmit={handleSubmit} className="frf-form">
          <label>
            Función f(x)
            <input
              type="text"
              name="f_expr"
              placeholder="x^3 + x - 1"
              value={form.f_expr}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Función g(x)
            <input
              type="text"
              name="g_expr"
              placeholder="1 - x^3"
              value={form.g_expr}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Valor inicial (x₀)
            <input
              type="number"
              name="x0"
              value={form.x0}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tolerancia
            <input
              type="number"
              name="tol"
              step="any"
              min="0.000000000000000000001"
              max="1"
              value={form.tol}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Número de iteraciones
            <input
              type="number"
              name="niter"
              min="1"
              max="100"
              value={form.niter}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tipo de error
            <select name="error_type" value={form.error_type} onChange={handleChange}>
              <option value="absolute">Absoluto</option>
              <option value="relative">Relativo</option>
            </select>
          </label>
          <button type="submit" className="frf-btn" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </form>

        {error && <div className="frf-error">{error}</div>}

        {result && (
          <div className="frf-result">
            <h3>Resultados</h3>
            <div><strong>Raíz aproximada:</strong> {result.root}</div>
            <div><strong>f(x):</strong> {result.f_expr}</div>
            <div><strong>g(x):</strong> {result.g_expr}</div>

            <div className="frf-table-container">
              <table className="frf-table">
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>x</th>
                    <th>g(x)</th>
                    <th>f(x)</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{row.x}</td>
                      <td>{row.g_x}</td>
                      <td>{row.f_x}</td>
                      <td>{row.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div id="desmos-graph" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
    </div>
  );
}
