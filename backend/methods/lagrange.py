from typing import List

import numpy as np
from pydantic import BaseModel


class LagranParams(BaseModel):
    x: List[float]
    y: List[float]


class LagranInt(BaseModel):
    x: List[float]
    y: List[float]
    polys: List[str]
    pol: str


def Lagrange(x: List[float], y: List[float]):
    polys = []

    for i in range(len(x)):
        num = []
        den = []
        for j in range(len(x)):
            if x[j] == x[i]:
                pass
            else:
                an = -x[j]
                if an < 0:
                    num.append(f"(x+{np.abs(x[j])})")
                    den.append(f"({x[i]}+{np.abs(x[j])})")
                elif an > 0:
                    num.append(f"(x-{x[j]})")
                    den.append(f"({x[i]}-{np.abs(x[j])})")
                else:
                    num.append("(x)")
                    den.append(f"({x[i]})")

        numjoin = "".join(num)
        denjoin = "".join(den)
        polys.append(numjoin + "/" + denjoin)
        pol = []
    for i in range(0, len(y) - 1):
        pol.append(str(y[i]) + "*" + polys[i])

    return LagranInt(x=x, y=y, polys=polys, pol="+".join(pol))
