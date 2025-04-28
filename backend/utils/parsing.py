import re
from typing import Union

import sympy
from pydantic import Field
from pydantic.functional_validators import AfterValidator
from sympy.parsing.latex import parse_latex
from typing_extensions import Annotated

x = sympy.Symbol("x")
pi_symbol = sympy.Symbol("pi")
e_symbol = sympy.Symbol("e")

ALLOWED_ATOMS = [
    # Numbers
    sympy.core.numbers.Zero,
    sympy.core.numbers.IntegerConstant,
    sympy.core.numbers.Integer,
    sympy.core.numbers.Rational,
    sympy.core.numbers.Number,
    sympy.core.numbers.Exp1,
    # Constants
    sympy.core.numbers.Pi,
    # Operators
    sympy.Abs,
    sympy.Add,
    sympy.Mul,
    sympy.Pow,
    # Symbols
    sympy.Symbol,
]

ALLOWED_FUNCTIONS = [
    sympy.sin,
    sympy.cos,
    sympy.tan,
    sympy.asin,
    sympy.acos,
    sympy.atan,
    sympy.exp,
    sympy.log,
    sympy.ln,
    sympy.sqrt,
    sympy.cbrt,
]

EXPRESSION_REGEX = r"^[a-zA-Z0-9\+\-\*\/\(\)\^\.\s\{\}\\]+$"


def check_expression_tree(expression: sympy.Expr) -> bool:
    """
    This functions checks a sympy expression to see if it contains any non-whitelisted functions.
    """

    if not isinstance(expression, tuple(ALLOWED_ATOMS)):
        try:
            if expression.func in ALLOWED_FUNCTIONS:
                return True
        except Exception:
            return False

        return False

    for arg in expression.args:
        if not check_expression_tree(arg):
            return False

    return True


def parse_function_expression(expression: str) -> sympy.Expr:
    """
    This function parses a string containing a function expression in Latex syntax and returns a sympy expression.

    Parameters
    ==========
    expression: A string containing a function expression in Latex syntax.
    """

    assert isinstance(expression, str), "Expression is not a string"
    assert re.match(
        EXPRESSION_REGEX, expression
    ), "Expression contains invalid characters"
    print(expression)

    try:
        parsed_expression = parse_latex(expression)
        parsed_expression = parsed_expression.subs(e_symbol, sympy.E)
        parsed_expression = parsed_expression.subs(pi_symbol, sympy.pi)
    except Exception as e:
        print(e)
        raise ValueError("Expression is not a valid Latex expression")

    assert isinstance(parsed_expression, sympy.Expr), "Expression is not a function"
    assert (
        len(parsed_expression.free_symbols) == 1
    ), "Expression is not a function of x, it does not have one free symbol"
    assert parsed_expression.free_symbols.pop() == sympy.Symbol(
        "x"
    ), "Expression is not a function of x"
    assert check_expression_tree(
        parsed_expression
    ), "Expression contains non-whitelisted functions"

    return parsed_expression


def to_latex(expression: Union[str, sympy.Expr]):
    """
    Convert a sympy expression to a Latex string.
    """

    if isinstance(expression, str):
        expression = parse_function_expression(expression)
    return sympy.latex(expression)


ExpressionAnnotation = Annotated[
    str,
    Field(..., description="A function expression in Latex syntax, e.g. 'x^{2} + 2'"),
    AfterValidator(parse_function_expression),
]
