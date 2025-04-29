from typing import Callable, List
import sympy
from pydantic import BaseModel, Field
from utils.errors import ErrorType, calculate_error
from utils.parsing import to_latex

# Se asume que ExpressionAnnotation no es necesario, lo reemplazamos por str
class BisectionIteration(BaseModel):
    iteration: int
    a: float
    b: float
    xm: float
    f_xm: float
    error: float


class BisectionRoots(BaseModel):
    expression: str  # La expresión ahora es un string.
    root: float
    table: List[BisectionIteration]


class BisectionRootsParams(BaseModel):
    expression: str  # Recibe una expresión en formato string
    error_type: ErrorType = ErrorType.ABSOLUTE
    a: float
    b: float
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


def bisection_roots(
    expr: sympy.Expr, error_type: str, a: float, b: float, tol: float, niter: int
) -> BisectionRoots:
    """
    Find a root of a function using the bisection method, requires a function to be continuous in the interval [a, b] and f(a) * f(b) < 0.
    """

    x = sympy.symbols("x")
    f: Callable[[float], float] = sympy.lambdify(x, expr, "math", docstring_limit=-1)

    fa = f(a)
    fb = f(b)

    if fa == 0:
        return a

    if fb == 0:
        return b

    assert fa * fb < 0, "f(a) and f(b) must have different signs"

    xm = (a + b) / 2
    fxm: float = f(xm)
    error = tol + 1
    iteration = 1

    data = [
        {"iteration": iteration, "a": a, "b": b, "xm": xm, "f_xm": fxm, "error": error}
    ]

    while error > tol and fxm != 0 and iteration < niter:
        if fa * fxm < 0:
            b = xm
            fb = fxm
        else:
            a = xm
            fa = fxm

        xm_old = xm
        xm = (a + b) / 2
        fxm = f(xm)
        error = calculate_error(xm, xm_old, error_type)
        iteration += 1

        it_data = {
            "iteration": iteration,
            "a": a,
            "b": b,
            "xm": xm,
            "f_xm": fxm,
            "error": error,
        }
        data.append(it_data)

    if error < tol or fxm == 0:
        return BisectionRoots(root=xm, table=data, expression=to_latex(expr))

    if iteration == niter:
        raise ValueError(f"The method failed after {niter} iterations")
