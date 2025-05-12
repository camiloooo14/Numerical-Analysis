import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './NewtonForm.css';
import Desmos from 'desmos';

export default function NewtonForm() {
  const [form, setForm] = useState({
    expression: '',
    df_expr: '',
    x0: '',
    tol: '0.0001',
    niter: '100',
    error_type: 'absolute'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculatorRef = useRef(null);

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
        niter: parseInt(form.niter, 10),
      };
      const response = await axios.post("http://127.0.0.1:8000/roots/newton", formData);
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

    if (calculatorRef.current && form.expression) {
      calculatorRef.current.setExpression({ id: 'graph1', latex: `y=${form.expression}` });
    }
  }, [form.expression]);

  useEffect(() => {
    if (calculatorRef.current && result?.table && Array.isArray(result.table)) {
      calculatorRef.current.setExpressions([
        { id: 'graph1', latex: `y=${form.expression}` },
        ...result.table.map((row, index) => ({
          id: `point${index}`,
          latex: `\\left(${row.x}, ${row.fx}\\right)`,
          showLabel: true,
          label: `x${index}`,
          color: Desmos.Colors.RED
        }))
      ]);
    }
  }, [result, form.expression]);

  return (
    <div className="frf-container">
      <div className="frf-card">
        <h2 className="frf-title">Método de Newton</h2>
        <form onSubmit={handleSubmit} className="frf-form">
          <label>
            Función f(x)
            <input
              type="text"
              name="expression"
              placeholder="x^2 - 4"
              value={form.expression}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Derivada f'(x)
            <input
              type="text"
              name="df_expr"
              placeholder="2*x"
              value={form.df_expr}
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
            <select name="error_type" value={form.error_type} onChange={handleChange} required>
              <option value="absolute">Absoluto</option>
              <option value="relative">Relativo</option>
            </select>
          </label>
          <button type="submit" className="frf-btn" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </form>

        <div id="desmos-graph" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>

        {error && <div className="frf-error">{error}</div>}
        {result && result.table && Array.isArray(result.table) && (
          <div className="frf-result">
            <h3>Resultados</h3>
            <div><b>Raíz encontrada:</b> {result.root}</div>
            <div className="frf-table-container">
              <table className="frf-table">
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>x</th>
                    <th>f(x)</th>
                    <th>f'(x)</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row, index) => (
                    <tr key={index}>
                      <td>{row.iteration}</td>
                      <td>{row.x}</td>
                      <td>{row.fx}</td>
                      <td>{row.dfx}</td>
                      <td>{row.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
