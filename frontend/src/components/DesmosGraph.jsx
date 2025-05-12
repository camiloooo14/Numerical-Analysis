import { useEffect, useRef } from 'react';
import Desmos from 'desmos';

export default function DesmosGraph({ expression, points = [] }) {
  const calculatorRef = useRef(null);
  const elt = useRef(null);

  useEffect(() => {
    if (!elt.current) return;

    if (calculatorRef.current) {
      calculatorRef.current.destroy();
    }

    const calculator = Desmos.GraphingCalculator(elt.current, {
      expressions: true,
      settingsMenu: false,
      zoomButtons: true,
      keypad: false,
    });

    calculatorRef.current = calculator;

    // Mostrar la función
    calculator.setExpression({ id: 'graph1', latex: expression });

    // Mostrar los puntos
    points.forEach((point, i) => {
      if (point.x !== null && point.y !== null) {
        calculator.setExpression({
          id: `pt${i}`,
          latex: `\\left(${point.x}, ${point.y}\\right)`,
          color: Desmos.Colors.RED,
          showLabel: true,
          label: `xₘ${i + 1}`
        });
      }
    });

    return () => {
      calculator.destroy();
    };
  }, [expression, points]);

  return <div style={{ width: '100%', height: '400px' }} ref={elt}></div>;
}
