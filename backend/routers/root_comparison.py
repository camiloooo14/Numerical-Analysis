from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Callable
import time

from RootFindingMethods.bisection import bisection_roots
from RootFindingMethods.regla_falsa import ReglaFalsa
from RootFindingMethods.newton import newton_roots
from RootFindingMethods.punto_fijo import fixed_point_roots
from RootFindingMethods.secante import Secante
from utils.errors import ErrorType

router = APIRouter(
    prefix="/comparisonRoot",
    tags=["comparisonRoot"]
)

class ComparacionRootEntrada(BaseModel):
    fx: str
    dfx: str = None  # Para Newton
    g: str = None    # Para Punto fijo
    x0: float
    x1: float = None  # Para métodos como falsa posición y secante
    tol: float
    niter: int

class ComparacionRootResultado(BaseModel):
    metodo: str
    raiz: float
    iteraciones: int
    error: float
    tiempo_ms: float
    converge: bool

def comparar_metodos(data: ComparacionRootEntrada) -> List[ComparacionRootResultado]:
    from sympy import symbols, lambdify, sympify

    x = symbols('x')
    fx_expr = sympify(data.fx)
    fx = lambdify(x, fx_expr, 'math')
    dfx = lambdify(x, sympify(data.dfx), 'math') if data.dfx else None
    g_expr = sympify(data.g) if data.g else None
    g = lambdify(x, g_expr, 'math') if g_expr else None

    resultados = []

    # Bisección
    try:
        start = time.time()
        result = bisection_roots(
            expr=fx_expr,
            error_type=ErrorType.ABSOLUTE,
            a=float(data.x0),
            b=float(data.x1),
            tol=float(data.tol),
            niter=int(data.niter)
        )
        tiempo = (time.time() - start) * 1000
        resultados.append(ComparacionRootResultado(
            metodo="Bisección",
            raiz=result.root,
            iteraciones=len(result.table),
            error=result.table[-1].error,
            tiempo_ms=tiempo,
            converge=True
        ))
    except Exception as e:
        print(f"Bisección falló: {e}")

    # Regla Falsa
    try:
        start = time.time()
        result = ReglaFalsa(
            f_expr=fx_expr,
            xl=float(data.x0),
            xu=float(data.x1),
            tol=float(data.tol),
            niter=int(data.niter),
            err=ErrorType.ABSOLUTE
        )
        tiempo = (time.time() - start) * 1000
        resultados.append(ComparacionRootResultado(
            metodo="Regla Falsa",
            raiz=result.root,
            iteraciones=len(result.table),
            error=result.table[-1].error,
            tiempo_ms=tiempo,
            converge=True
        ))
    except Exception as e:
        print(f"Regla Falsa falló: {e}")

    # Newton
    if dfx:
        try:
            start = time.time()
            result = newton_roots(
                expr=fx_expr,
                error_type=ErrorType.ABSOLUTE,
                multiple_roots=False,
                x0=float(data.x0),
                tol=float(data.tol),
                niter=int(data.niter)
            )
            tiempo = (time.time() - start) * 1000
            resultados.append(ComparacionRootResultado(
                metodo="Newton",
                raiz=result.root,
                iteraciones=len(result.table),
                error=result.table[-1].error,
                tiempo_ms=tiempo,
                converge=True
            ))
        except Exception as e:
            print(f"Newton falló: {e}")

    # Punto Fijo
    if g_expr:
        try:
            start = time.time()
            result = fixed_point_roots(
                f_expr=fx_expr,
                g_expr=g_expr,
                x0=float(data.x0),
                error_type=ErrorType.ABSOLUTE,
                tol=float(data.tol),
                niter=int(data.niter)
            )
            tiempo = (time.time() - start) * 1000
            resultados.append(ComparacionRootResultado(
                metodo="Punto Fijo",
                raiz=result.root,
                iteraciones=len(result.table),
                error=result.table[-1].error,
                tiempo_ms=tiempo,
                converge=True
            ))
        except Exception as e:
            print(f"Punto Fijo falló: {e}")

    # Secante
    try:
        start = time.time()
        result = Secante(
            f_expr=fx_expr,
            x0=float(data.x0),
            x1=float(data.x1),
            tol=float(data.tol),
            niter=int(data.niter),
            err=ErrorType.ABSOLUTE
        )
        tiempo = (time.time() - start) * 1000
        resultados.append(ComparacionRootResultado(
            metodo="Secante",
            raiz=result.root,
            iteraciones=len(result.table),
            error=result.table[-1].error,
            tiempo_ms=tiempo,
            converge=True
        ))
    except Exception as e:
        print(f"Secante falló: {e}")

    return resultados

@router.post(
    "/comparisonRootFinding",
    response_model=List[ComparacionRootResultado]
)
def comparar_root_methods(params: ComparacionRootEntrada):
    try:
        return comparar_metodos(params)
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={"detail": "Comparison failed", "error": str(e)},
        )
