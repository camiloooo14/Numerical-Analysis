from typing import Callable, List, Tuple

import sympy
from pydantic import BaseModel, Field

from utils.errors import ErrorType, calculate_error
from utils.parsing import ExpressionAnnotation, to_latex


class FalseRuleParams(BaseModel):
    f_expr: ExpressionAnnotation
    xl: float
    xu: float
    error_type: ErrorType = ErrorType.ABSOLUTE
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


class FalseRuleIteration(BaseModel):
    xl: float
    xm: float
    xu: float
    f_x: float
    error: float


class FalseRuleRoots(BaseModel):
    f_expr: str
    root: float
    table: List[FalseRuleIteration]


def ReglaFalsa(
    f_expr: sympy.Expr, xl: float, xu: float, tol: float, niter: int, err: str
):
    """
    INPUT ARGS:

    f: Python Function with a single input argument
    xl: Lower Bound
    xu: Upper Bound
    tol: Error tolerance for the method
    niter: Max number of iterations
    err: Type of error processing, 0 = absolute, 1 = relative
    """

    x = sympy.symbols("x")
    f: Callable[[float], float] = sympy.lambdify(x, f_expr, "math", docstring_limit=-1)

    if f(xl) * f(xu) > 0:
        raise ValueError(f"There is no root in the interval [{xl},{xu}]")

    result: List[FalseRuleIteration] = [
        {
            "xl": xl,
            "xm": xu - f(xu) * ((xu - xl) / (f(xu) - f(xl))),
            "xu": xu,
            "f_x": f(xu - f(xu) * ((xu - xl) / (f(xu) - f(xl)))),
            "error": xu,
        }
    ]
    for i in range(0, niter):
        if f(result[i]["xm"]) * f(result[i]["xl"]) > 0:
            xl = result[i]["xm"]

        elif f(result[i]["xm"]) * f(result[i]["xu"]) > 0:
            xu = result[i]["xm"]
        result.append(
            {
                "xl": xl,
                "xm": xu - f(xu) * ((xu - xl) / (f(xu) - f(xl))),
                "xu": xu,
                "f_x": f(xu - f(xu) * ((xu - xl) / (f(xu) - f(xl)))),
                "error": calculate_error(
                    result[i]["xm"], xu - f(xu) * ((xu - xl) / (f(xu) - f(xl))), err
                ),
            }
        )
        if result[i]["error"] < tol:
            return FalseRuleRoots(
                f_expr=to_latex(f_expr), root=result[i]["xm"], table=result
            )
    raise ValueError(f"Method failed after {niter} iterations")
