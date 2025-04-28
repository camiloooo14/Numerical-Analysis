from enum import Enum


class ErrorType(str, Enum):
    ABSOLUTE = "absolute"
    RELATIVE = "relative"


def absolute_error(x: float, x_hat: float) -> float:
    return abs(x - x_hat)


def relative_error(x: float, x_hat: float) -> float:
    return abs(x - x_hat) / abs(x)


def calculate_error(
    x: float, x_hat: float, error_type: ErrorType = ErrorType.ABSOLUTE
) -> float:
    if error_type == ErrorType.ABSOLUTE:
        return absolute_error(x, x_hat)
    elif error_type == ErrorType.RELATIVE:
        return relative_error(x, x_hat)
    else:
        raise ValueError(f"Invalid error type: {error_type}")
