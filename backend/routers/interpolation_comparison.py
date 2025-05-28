from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import time

from InterpolationMethods.lagrange import Lagrange
from InterpolationMethods.vandermonde import Vandermonde
from InterpolationMethods.newton_int import NewtonInterpol
from InterpolationMethods.spline import get_spline, SplineType

router = APIRouter(
    prefix="/comparisonInterpolation",
    tags=["comparisonInterpolation"]
)

class ComparacionInterpolacionEntrada(BaseModel):
    x: List[float]
    y: List[float]
    grado: int = None  # Para splines

class ComparacionInterpolacionResultado(BaseModel):
    metodo: str
    polinomio: str
    tiempo_ms: float
    error: float = None
    grado: int = None

def get_spline_type(grado: int) -> SplineType:
    if grado == 1:
        return SplineType.LINEAR
    elif grado == 2:
        return SplineType.QUADRATIC
    else:
        return SplineType.CUBIC

def format_spline_coefficients(coeffs: List[List[float]], x: List[float]) -> str:
    result = []
    for i, coef in enumerate(coeffs):
        terms = []
        for j, c in enumerate(reversed(coef)):
            if c != 0:
                if j == 0:
                    terms.append(f"{c:g}")
                elif j == 1:
                    terms.append(f"{c:g}*x")
                else:
                    terms.append(f"{c:g}*x^{j}")
        if terms:
            interval = f" para x ∈ [{x[i]}, {x[i+1]}]"
            result.append("(" + " + ".join(terms) + ")" + interval)
    return "\n".join(result)

def comparar_metodos(data: ComparacionInterpolacionEntrada) -> List[ComparacionInterpolacionResultado]:
    resultados = []

    # Lagrange
    try:
        start = time.time()
        result = Lagrange(data.x, data.y)
        tiempo = (time.time() - start) * 1000
        resultados.append(ComparacionInterpolacionResultado(
            metodo="Lagrange",
            polinomio=result.pol,
            tiempo_ms=tiempo
        ))
    except Exception as e:
        print(f"Lagrange falló: {e}")

    # Vandermonde
    try:
        start = time.time()
        result = Vandermonde(data.x, data.y)
        tiempo = (time.time() - start) * 1000
        resultados.append(ComparacionInterpolacionResultado(
            metodo="Vandermonde",
            polinomio=result.pol,
            tiempo_ms=tiempo
        ))
    except Exception as e:
        print(f"Vandermonde falló: {e}")

    # Newton
    try:
        start = time.time()
        result = NewtonInterpol(data.x, data.y)
        tiempo = (time.time() - start) * 1000
        resultados.append(ComparacionInterpolacionResultado(
            metodo="Newton",
            polinomio=result.pol,
            tiempo_ms=tiempo
        ))
    except Exception as e:
        print(f"Newton falló: {e}")

    # Spline
    if data.grado is not None:
        try:
            start = time.time()
            spline_type = get_spline_type(data.grado)
            result = get_spline(data.x, data.y, spline_type)
            tiempo = (time.time() - start) * 1000
            resultados.append(ComparacionInterpolacionResultado(
                metodo=f"Spline {spline_type.value}",
                polinomio=format_spline_coefficients(result.coefficients, data.x),
                tiempo_ms=tiempo,
                grado=data.grado
            ))
        except Exception as e:
            print(f"Spline falló: {e}")

    return resultados

@router.post(
    "/comparisonInterpolation",
    response_model=List[ComparacionInterpolacionResultado]
)
def comparar_interpolation_methods(params: ComparacionInterpolacionEntrada):
    try:
        return comparar_metodos(params)
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={"detail": "Comparison failed", "error": str(e)},
        ) 