from typing import Callable, List, Tuple



import sympy
from pydantic import BaseModel, Field

from utils.errors import ErrorType, calculate_error
from utils.parsing import ExpressionAnnotation, to_latex


class BisectionIteration(BaseModel):
    iteration: int
    a: float
    b: float
    xm: float
    f_xm: float
    error: float


class BisectionRoots(BaseModel):
    expression: str
    root: float
    table: List[BisectionIteration]


class BisectionRootsParams(BaseModel):
    expression: ExpressionAnnotation
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

    Parameters
    ==========

    expr: A sympy expression representing the function.
    a: The left bound of the interval.
    b: The right bound of the interval.
    tol: The tolerance of the method.
    niter: The maximum number of iterations.

    Returns
    =======

    A tuple containing the root and a pandas dataframe with the iterations data.
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
