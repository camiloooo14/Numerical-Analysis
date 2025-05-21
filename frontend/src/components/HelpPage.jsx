import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export default function HelpPage() {
  return (
    <div className="help-container" style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Bienvenido a la herramienta de Análisis Numérico</h1>
      <p>Este proyecto incluye implementaciones para resolver problemas clásicos de análisis numérico.</p>

      <h2>Métodos de Búsqueda de Raíces</h2>
      <ul>
        <li><strong>Bisección:</strong> Divide el intervalo hasta encontrar la raíz con la precisión deseada.</li>
        <li><strong>Newton:</strong> Usa derivadas para aproximar la raíz.</li>
        <li><strong>Punto Fijo:</strong> Itera sobre una función <InlineMath math="g(x)" /> para encontrar la raíz.</li>
        <li><strong>Regla Falsa:</strong> Similar a bisección, pero con mejor convergencia. Se deben ingresar dos valores con signo opuesto para que la función cambie de signo.</li>
        <li><strong>Secante:</strong> Variante de Newton sin usar derivadas.</li>
        <li><strong>Simbólica:</strong> Utiliza análisis simbólico para encontrar raíces.</li>
      </ul>

      <h2>Métodos de Interpolación</h2>
      <ul>
        <li><strong>Lagrange:</strong> Interpolación basada en polinomios.</li>
        <li><strong>Newton:</strong> Usa diferencias divididas.</li>
        <li><strong>Spline:</strong> Interpolación a tramos suave.</li>
        <li><strong>Vandermonde:</strong> Usa matrices para interpolar puntos.</li>
      </ul>

      <h2>Métodos para Sistemas de Ecuaciones Lineales</h2>
      <ul>
        <li><strong>Jacobi:</strong> Método iterativo.</li>
        <li><strong>Gauss-Seidel:</strong> Iteración mejorada sobre Jacobi.</li>
        <li><strong>SOR:</strong> Relaja el método de Gauss-Seidel para mejorar la convergencia.</li>
        <li><strong>Consejos:</strong> Evitar ingresar matices singulares para mejorar la precisión.</li>
      </ul>

      <h2>Entrada de Funciones</h2>
      <p>Las funciones deben escribirse en formato <strong>LaTeX</strong>. Ejemplos:</p>
      <ul>
        <li>
          <code>x^2 + 2x - 3</code> → 
          <InlineMath math="x^2 + 2x - 3" />
        </li>
        <li>
          <code>{'\sqrt{x + 1}'}</code> → 
          <InlineMath math={'\\sqrt{x + 1}'} />
        </li>
        <li>
          <code>{'\frac{1}{x^2 + 1}'}</code> → 
          <InlineMath math={'\\frac{1}{x^2 + 1}'} />
        </li>
        <li>
          <InlineMath math={'\\sin(x)'} />, 
          <InlineMath math={'\\cos(x)'} />, 
          <InlineMath math={'\\ln(x)'} />
        </li>
      </ul>


      <footer style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        Desarrollado por Sara, Camilo, Lorena y Samuel – Proyecto de métodos numéricos
      </footer>
    </div>
  );
}
