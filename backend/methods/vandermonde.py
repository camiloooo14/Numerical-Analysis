from typing import List

import numpy as np
from pydantic import BaseModel


class VanderParams(BaseModel):
    x: List[float]
    y: List[float]


class VanderInt(BaseModel):
    x: List[float]
    y: List[float]
    coefficients: List[float]
    pol: str


def Vandermonde(x: List[float], y: List[float]):
    A = np.zeros((len(x), len(x)))
    for i in range(0, len(x)):
        for j in range(0, len(x)):
            A[i][j] = np.power(x[i], j)
    b = np.array(y)
    coefficients = (np.flip(np.linalg.solve(A, b))).tolist()
    pol = []
    order = len(coefficients) - 1
    for item in coefficients:
        if item < 0:
            pol.append(f"-{np.abs(item)}x^{order}")
        elif item > 0:
            pol.append(f"+{np.abs(item)}x^{order}")
        else:
            pol.append(f"+0x^{order}")
        order = order - 1
    return VanderInt(x=x, y=y, coefficients=coefficients, pol="".join(pol))