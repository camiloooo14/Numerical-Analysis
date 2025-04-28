from typing import Callable, List, Tuple

import sympy
from pydantic import BaseModel, Field

from backend.utils.errors import ErrorType, calculate_error
from backend.utils.parsing import ExpressionAnnotation, to_latex

class NewtonIteration(BaseModel):
    iteration: int
    x: float
    f_x: float
    f_prime_x: float
    error: float


class NewtonRoots(BaseModel):
    expression: str
    derivative: str
    root: float
    table: List[NewtonIteration]


class NewtonRootsParams(BaseModel):
    expression: ExpressionAnnotation
    error_type: ErrorType = ErrorType.ABSOLUTE
    multiple_roots: bool = False
    x0: float
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


def newton_roots(
    expr: sympy.Expr, error_type: str, multiple_roots: bool, x0: float, tol: float, niter: int
) -> NewtonRoots:
    """
    Find a root of a function using the Newton-Raphson method, requires a function to be continuous in the interval [a, b] and f(a) * f(b) < 0.

    Parameters
    ==========

    expr: A sympy expression representing the function.
    x0: The initial value.
    tol: The tolerance of the method.
    niter: The maximum number of iterations.
    """

    x = sympy.symbols("x")
    expr_prime = expr.diff(x)
    expr_prime2 = expr_prime.diff(x, 2)
    f: Callable[[float], float] = sympy.lambdify(x, expr, "math", docstring_limit=-1)
    f_prime: Callable[[float], float] = sympy.lambdify(x, expr_prime, "math")

    if multiple_roots:
        f = lambda x: f(x) / f_prime(x)
        f_prime = sympy.lambdify(x, expr_prime2, "math")

    x_old = x0
    fx_old = f(x_old)
    fx_prime_old = f_prime(x_old)
    error = 1
    iteration = 1
    data = [
        {
            "iteration": 1,
            "x": x_old,
            "f_x": fx_old,
            "f_prime_x": fx_prime_old,
            "error": error,
        }
    ]

    while error > tol and fx_old != 0 and fx_prime_old != 0 and iteration < niter:
        x_new = x_old - fx_old / fx_prime_old
        fx_new = f(x_new)
        fx_prime_new = f_prime(x_new)
        error = calculate_error(x_new, x_old, error_type)
        x_old = x_new
        fx_old = fx_new
        fx_prime_old = fx_prime_new
        iteration += 1

        it_data = {
            "iteration": iteration,
            "x": x_new,
            "f_x": fx_new,
            "f_prime_x": fx_prime_new,
            "error": error,
        }
        data.append(it_data)

    if error < tol or fx_old == 0 or fx_prime_old == 0:
        return NewtonRoots(
            multiple_roots=multiple_roots,
            derivative=to_latex(expr_prime),
            second_derivative=to_latex(expr_prime2),
            root=x_new,
            table=data,
            expression=to_latex((expr/expr_prime) if multiple_roots else expr),
        )

    raise ValueError(f"Failed after {niter} iterations")
