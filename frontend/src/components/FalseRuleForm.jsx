import { useState } from 'react';
import axios from 'axios';
import './FalseRuleForm.css';
import DesmosGraph from './DesmosGraph';

export default function FalseRuleForm() {
  const [form, setForm] = useState({
    f_expr: '',
    xl: '',
    xu: '',
    tol: '0.0001',
    niter: '100',
    error_type: 'absolute'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        xl: parseFloat(form.xl),
        xu: parseFloat(form.xu),
        tol: parseFloat(form.tol),
        niter: parseInt(form.niter, 10),
      };
      const response = await axios.post("http://127.0.0.1:8000/roots/false_rule", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Crear expresiones para puntos xm
  const points = result?.table.map(row => ({
    x: row.xm,
    y: row.f_xm
  })) || [];

  return (
    <div className="frf-container">
      <div className="frf-card">
        <h2 className="frf-title">Método de Regla Falsa</h2>
        <form onSubmit={handleSubmit} className="frf-form">
          <label>
            Función f(x)
            <input type="text" name="f_expr" placeholder="x^2 - 4" value={form.f_expr} onChange={handleChange} required />
          </label>
          <label>
            Límite inferior (xl)
            <input type="number" name="xl" value={form.xl} onChange={handleChange} required />
          </label>
          <label>
            Límite superior (xu)
            <input type="number" name="xu" value={form.xu} onChange={handleChange} required />
          </label>
          <label>
            Tolerancia
            <input type="number" name="tol" step="any" min="0.000000000000000000001" max="1" value={form.tol} onChange={handleChange} required />
          </label>
          <label>
            Número de iteraciones
            <input type="number" name="niter" min="1" max="100" value={form.niter} onChange={handleChange} required />
          </label>
          <label>
            Tipo de error
            <select name="error_type" value={form.error_type} onChange={handleChange} required>
              <option value="absolute">Absoluto</option>
              <option value="relative">Relativo</option>
            </select>
          </label>
          <button type="submit" className="frf-btn" disabled={loading}>{loading ? 'Calculando...' : 'Calcular'}</button>
        </form>

        {form.f_expr && (
          <div style={{ marginTop: '30px' }}>
            <h3>Gráfica de f(x)</h3>
            <DesmosGraph expression={form.f_expr.replace(/\^/g, '^')} points={points} />
          </div>
        )}

        {error && <div className="frf-error">{error}</div>}
        {result && (
          <div className="frf-result">
            <h3>Resultados</h3>
            <div><b>Raíz encontrada:</b> {result.root}</div>
            <div className="frf-table-container">
              <table className="frf-table">
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>xl</th>
                    <th>xu</th>
                    <th>xm</th>
                    <th>f(xm)</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row, index) => (
                    <tr key={index}>
                      <td>{row.iteration}</td>
                      <td>{row.xl}</td>
                      <td>{row.xu}</td>
                      <td>{row.xm}</td>
                      <td>{row.f_xm}</td>
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
