from typing import Callable, List, Tuple

import sympy
from pydantic import BaseModel, Field

from utils.errors import ErrorType, calculate_error
from utils.parsing import ExpressionAnnotation, to_latex


class FixedPointParams(BaseModel):
    f_expr: ExpressionAnnotation
    g_expr: ExpressionAnnotation

    x0: float

    error_type: ErrorType = ErrorType.ABSOLUTE
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


class FixedPointIteration(BaseModel):
    x: float
    g_x: float
    f_x: float
    error: float


class FixedPointRoots(BaseModel):
    f_expr: str
    g_expr: str
    root: float
    table: List[FixedPointIteration]


def fixed_point_roots(
    f_expr: sympy.Expr,
    g_expr: sympy.Expr,
    x0: float,
    error_type: str,
    tol: float,
    niter: int,
):
    x = sympy.symbols("x")
    f: Callable[[float], float] = sympy.lambdify(x, f_expr, "math", docstring_limit=-1)
    g: Callable[[float], float] = sympy.lambdify(x, g_expr, "math", docstring_limit=-1)

    data: List[FixedPointIteration] = [
        {"x": x0, "g_x": g(x0), "f_x": f(x0), "error": x0}
    ]

    for i in range(niter):
        xi = g(data[-1]["g_x"])
        g_x = g(xi)
        f_x = f(xi)
        error = calculate_error(data[-1]["x"], xi, error_type)

        data.append(
            {
                "x": data[-1]["g_x"],
                "g_x": g_x,
                "f_x": f_x,
                "error": error,
            }
        )

        if error < tol:
            return FixedPointRoots(
                f_expr=to_latex(f_expr),
                g_expr=to_latex(g_expr),
                root=data[-1]["x"],
                table=data,
            )

    raise ValueError(f"Method failed after {niter} iterations")
