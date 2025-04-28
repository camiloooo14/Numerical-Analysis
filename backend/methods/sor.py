from typing import List

import numpy as np
from pydantic import BaseModel, Field


# Clases y estructuras
class SORParams(BaseModel):
    matrix_a: List[List[float]]
    vector_b: List[float]
    x0: List[float]
    relaxation_factor: float = Field(..., gt=0, le=2)
    tol: float = Field(..., gt=1e-21, le=1)
    niter: int = Field(..., gt=0, le=100)


class SORIteration(BaseModel):
    step: int
    x: List[float]
    error: float


class SORResult(BaseModel):
    solution: List[float]
    transition_matrix: List[List[float]]
    coefficient_matrix: List[List[float]]
    spectral_radius: float
    iterations: List[SORIteration]
    converges: bool


# Método SOR adaptado
def sor_method(params: SORParams) -> SORResult:
    A = np.array(params.matrix_a)
    b = np.array(params.vector_b).reshape((-1, 1))
    x0 = np.array(params.x0).reshape((-1, 1))
    w = params.relaxation_factor

    D = np.diag(np.diag(A))
    L = -1 * np.tril(A) + D
    U = -1 * np.triu(A) + D
    T = np.linalg.inv(D - L) @ U
    C = np.linalg.inv(D - L) @ b

    spectral_radius = max(abs(np.linalg.eigvals(T)))
    converges = spectral_radius < 1

    iterations = []
    xP = x0
    for k in range(params.niter):
        xA = np.zeros_like(xP)
        for i in range(A.shape[0]):
            s1 = np.dot(A[i, :i], xA[:i])
            s2 = np.dot(A[i, i + 1 :], xP[i + 1 :])
            xA[i] = (b[i] - s1 - s2) / A[i, i] * w + (1 - w) * xP[i]
        error = np.linalg.norm(xP - xA)
        xP = xA

        iterations.append(SORIteration(step=k, x=xA.flatten().tolist(), error=error))
        if error < params.tol:
            break

    return SORResult(
        solution=xP.flatten().tolist(),
        transition_matrix=T.tolist(),
        coefficient_matrix=C.tolist(),
        spectral_radius=spectral_radius,
        iterations=iterations,
        converges=converges,
    )
