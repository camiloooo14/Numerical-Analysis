from typing import Any
from pydantic import BaseModel


import sympy

from utils.parsing import ExpressionAnnotation, to_latex


class SymbolicRoots(BaseModel):
    expression: str
    roots: str


class SymbolicRootsParams(BaseModel):
    expression: ExpressionAnnotation


def symbolic_roots(expr: sympy.Expr) -> SymbolicRoots:
    x = sympy.Symbol("x")
    return SymbolicRoots(
        expression=to_latex(expr), roots=to_latex(sympy.solve(expr, x))
    )
