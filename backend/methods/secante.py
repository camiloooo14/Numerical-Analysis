from typing import Callable, List, Tuple

import sympy
from pydantic import BaseModel, Field

from utils.errors import ErrorType, calculate_error
from utils.parsing import ExpressionAnnotation, to_latex


class SecanteParams(BaseModel):
    f_expr: ExpressionAnnotation
    x0: float
    x1: float
    error_type: ErrorType = ErrorType.ABSOLUTE
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


class SecanteIteration(BaseModel):
    xi: float
    f_x: float
    error: float


class SecanteRoots(BaseModel):
    f_expr: str
    root: float
    table: List[SecanteIteration]


def Secante(f_expr: sympy.Expr, x0: float, x1: float, niter: int, tol: float, err: str):
    """
    INPUT ARGS:

    f: Python Function with a single input argument
    x0: first initial value
    x1: second initial value
    tol: Error tolerance for the method
    niter: Max number of iterations
    err: Type of error processing, 0 = absolute, 1 = relative
    """
    x = sympy.symbols("x")
    f: Callable[[float], float] = sympy.lambdify(x, f_expr, "math", docstring_limit=-1)

    result: List[SecanteIteration] = [
        {"xi": x0, "f_x": f(x0), "error": x0},
        {"xi": x1, "f_x": f(x1), "error": calculate_error(x0, x1, err)},
    ]
    print(result)
    for i in range(0, niter):
        print("nepe")
        xi = result[i + 1]["xi"] - (
            (result[i + 1]["f_x"] * (result[i + 1]["xi"] - result[i]["xi"]))
            / (result[i + 1]["f_x"] - result[i]["f_x"])
        )
        fi = f(xi)
        result.append(
            {
                "xi": xi,
                "f_x": fi,
                "error": calculate_error(result[i + 1]["xi"], xi, err),
            }
        )
        if result[-1]["error"] < tol:
            return SecanteRoots(
                f_expr=to_latex(f_expr), root=result[-1]["xi"], table=result
            )
    raise ValueError(f"Method failed after {niter} iterations")
