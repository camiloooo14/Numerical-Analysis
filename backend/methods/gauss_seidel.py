from typing import List

import numpy as np
from pydantic import BaseModel, Field


# Clases y estructuras
class GaussSeidelParams(BaseModel):
    matrix_a: List[List[float]]
    vector_b: List[float]
    x0: List[float]
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


class GaussSeidelIteration(BaseModel):
    step: int
    x: List[float]
    error: float


class GaussSeidelResult(BaseModel):
    transition_matrix: List[List[float]]
    coefficient_matrix: List[List[float]]
    spectral_radius: float
    iterations: List[GaussSeidelIteration]
    converges: bool


# Método de Gauss-Seidel adaptado
def gauss_seidel_method(params: GaussSeidelParams) -> GaussSeidelResult:
    A = np.array(params.matrix_a)
    b = np.array(params.vector_b).reshape((-1, 1))
    x0 = np.array(params.x0).reshape((-1, 1))

    D = np.diag(np.diag(A))
    L = -1 * np.tril(A) + D
    U = -1 * np.triu(A) + D
    T = np.linalg.inv(D - L) @ U
    C = np.linalg.inv(D - L) @ b

    spectral_radius = max(abs(np.linalg.eigvals(T)))
    converges = spectral_radius < 1

    iterations = []
    xP = x0
    for i in range(params.niter):
        xA = T @ xP + C
        error = np.linalg.norm(xP - xA)
        xP = xA

        iterations.append(
            GaussSeidelIteration(step=i, x=xA.flatten().tolist(), error=error)
        )
        if error < params.tol:
            break

    return GaussSeidelResult(
        transition_matrix=T.tolist(),
        coefficient_matrix=C.tolist(),
        spectral_radius=spectral_radius,
        iterations=iterations,
        converges=converges,
    )
