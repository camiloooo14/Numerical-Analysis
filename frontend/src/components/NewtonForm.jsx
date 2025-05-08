import { useState } from 'react';
import axios from 'axios';
//import './NewtonForm.css'; 


export default function NewtonForm() {
  const [form, setForm] = useState({
    f_expr: '',
    df_expr: '',
    x0: '',
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

  return (
    <div className="frf-container">
      <div className="frf-card">
        <h2 className="frf-title">Método de Newton</h2>
        <form onSubmit={handleSubmit} className="frf-form">
          <label>
            Función f(x)
            <input type="text" name="expression" placeholder="x^2 - 4" value={form.expression} onChange={handleChange} required />
          </label>
          <label>
            Valor inicial (x₀)
            <input type="number" name="x0" value={form.x0} onChange={handleChange} required />
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
          <button type="submit" className="frf-btn" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </form>
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
