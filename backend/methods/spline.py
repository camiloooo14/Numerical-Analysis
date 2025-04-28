from enum import Enum
from typing import List

import numpy as np
from pydantic import BaseModel


class SplineType(str, Enum):
    LINEAR = "linear"
    QUADRATIC = "quadratic"
    CUBIC = "cubic"


class SplineParams(BaseModel):
    x: List[float]
    y: List[float]
    d: SplineType = SplineType.LINEAR


class Spline(BaseModel):
    x: List[float]
    y: List[float]
    d: SplineType = SplineType.LINEAR
    coefficients: List[List[float]]


D_VALUES = {
    "linear": 1,
    "quadratic": 2,
    "cubic": 3,
}


def get_spline(
    x: List[float], y: List[float], spline_type: SplineType = SplineType.LINEAR
) -> Spline:
    n = len(x)
    d = D_VALUES[spline_type.value]
    A = np.zeros(((d + 1) * (n - 1), (d + 1) * (n - 1)))
    b = np.zeros(((d + 1) * (n - 1), 1))
    cua = np.power(x, 2)
    cub = np.power(x, 3)

    if spline_type == SplineType.LINEAR:  # Linear
        A, b = construct_linear_spline(x, y, n, A, b)
        val = np.linalg.inv(A).dot(b)
        tabla = np.reshape(val, (n - 1, d + 1))
        return Spline(x=x, y=y, d=spline_type, coefficients=tabla.tolist())

    elif spline_type == SplineType.QUADRATIC:  # Quadratic
        A, b = construct_quadratic_spline(x, y, n, A, b, cua)
        val = np.linalg.inv(A).dot(b)
        tabla = np.reshape(val, (n - 1, d + 1))
        return Spline(x=x, y=y, d=spline_type, coefficients=tabla.tolist())

    elif spline_type == SplineType.CUBIC:
        A, b = construct_cubic_spline(x, y, n, A, b, cua, cub)
        val = np.linalg.inv(A).dot(b)
        tabla = np.reshape(val, (n - 1, d + 1))
        return Spline(x=x, y=y, d=spline_type, coefficients=tabla.tolist())


def construct_linear_spline(
    x: List[float], y: List[float], n: int, A: np.ndarray, b: np.ndarray
):
    c = 0
    h = 0
    for i in range(0, n - 1):
        A[h, c] = x[i]
        A[h, c + 1] = 1
        b[h] = y[i]
        c += 2
        h += 1

    c = 0
    for i in range(1, n):
        A[h, c] = x[i]
        A[h, c + 1] = 1
        b[h] = y[i]
        c += 2
        h += 1

    return A, b


def construct_quadratic_spline(
    x: List[float],
    y: List[float],
    n: int,
    A: np.ndarray,
    b: np.ndarray,
    cua: np.ndarray,
):
    c = 0
    h = 0
    for i in range(0, n - 1):
        A[h, c] = cua[i]
        A[h, c + 1] = x[i]
        A[h, c + 2] = 1
        b[h] = y[i]
        c += 3
        h += 1

    c = 0
    for i in range(1, n):
        A[h, c] = cua[i]
        A[h, c + 1] = x[i]
        A[h, c + 2] = 1
        b[h] = y[i]
        c += 3
        h += 1

    c = 0
    for i in range(1, n - 1):
        A[h, c] = 2 * x[i]
        A[h, c + 1] = 1
        A[h, c + 3] = -2 * x[i]
        A[h, c + 4] = -1
        b[h] = 0
        c += 4
        h += 1

    A[h, 0] = 2
    b[h] = 0

    return A, b


def construct_cubic_spline(
    x: List[float],
    y: List[float],
    n: int,
    A: np.ndarray,
    b: np.ndarray,
    cua: np.ndarray,
    cub: np.ndarray,
):
    c = 0
    h = 0
    for i in range(0, n - 1):
        A[h, c] = cub[i]
        A[h, c + 1] = cua[i]
        A[h, c + 2] = x[i]
        A[h, c + 3] = 1
        b[h] = y[i]
        c += 4
        h += 1

    c = 0
    for i in range(1, n):
        A[h, c] = cub[i]
        A[h, c + 1] = cua[i]
        A[h, c + 2] = x[i]
        A[h, c + 3] = 1
        b[h] = y[i]
        c += 4
        h += 1

    c = 0
    for i in range(1, n - 1):
        A[h, c] = 3 * cua[i]
        A[h, c + 1] = 2 * x[i]
        A[h, c + 2] = 1
        A[h, c + 4] = -3 * cua[i]
        A[h, c + 5] = -2 * x[i]
        A[h, c + 6] = -1
        b[h] = 0
        c += 4
        h += 1

    c = 0
    for i in range(1, n - 1):
        A[h, c] = 6 * x[i]
        A[h, c + 1] = 2
        A[h, c + 4] = -6 * x[i]
        A[h, c + 5] = -2
        b[h] = 0
        c += 4
        h += 1

    A[h, 0] = 6 * x[0]
    A[h, 1] = 2
    b[h] = 0
    h += 1
    A[h, c] = 6 * x[-1]
    A[h, c + 1] = 2
    b[h] = 0

    return A, b
