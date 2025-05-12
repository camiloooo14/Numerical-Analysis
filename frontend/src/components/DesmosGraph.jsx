// DesmosGraph.js
import { useEffect, useRef } from "react";
import Desmos from "desmos";

export default function DesmosGraph({ expression }) {
  const calculatorRef = useRef(null);

  useEffect(() => {
    const elt = calculatorRef.current;
    const calculator = Desmos.GraphingCalculator(elt, {
      expressions: true,
      settingsMenu: false,
    });

    calculator.setExpression({ id: "graph1", latex: `f(x)=${expression}` });

    return () => calculator.destroy();
  }, [expression]);

  return <div ref={calculatorRef} style={{ width: "100%", height: "400px" }} />;
}
