from typing import List

import numpy as np
from pydantic import BaseModel


class NewtonParams(BaseModel):
    x: List[float]
    y: List[float]


class NewtonInt(BaseModel):
    x: List[float]
    y: List[float]
    coefficients: List[List[float]]
    pol: str


def NewtonInterpol(x: List[float], y: List[float]):
    n = len(y)
    coef = np.zeros([n, n])
    coef[:, 0] = y
    for j in range(1, n):
        for i in range(n - j):
            coef[i][j] = (coef[i + 1][j - 1] - coef[i][j - 1]) / (x[i + j] - x[i])
    res = coef
    pol = []
    mult = ""
    for i in range(0, len(x)):
        pol.append(str(coef[0][i]) + mult)
        if x[i] < 0:
            mult = mult + (f"(x+{np.abs(x[i])})")
        elif x[i] > 0:
            mult = mult + (f"(x-{np.abs(x[i])})")
        else:
            mult = mult + (f"(x)")
    return NewtonInt(x=x, y=y, coefficients=res.tolist(), pol="+".join(pol))
