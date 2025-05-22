from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import time
from LinearSystemsMethods.gauss_seidel import gauss_seidel_method, GaussSeidelParams
from LinearSystemsMethods.jacobi import jacobi_method, JacobiParams
from LinearSystemsMethods.sor import sor_method, SORParams

router = APIRouter(
    prefix="/comparison",
    tags=["comparison"],
)

responses = {
    409: {
        "description": "Comparison Failed",
    },
}


class ComparacionEntrada(BaseModel):
    matrix_a: List[List[float]]
    vector_b: List[float]
    x0: List[float]
    tol: float
    niter: int
    relaxation_factor: float = 1.1

class ComparacionResultado(BaseModel):
    metodo: str
    iteraciones: int
    error_final: float
    radio_espectral: float
    converge: bool
    tiempo_ms: float

def comparisonLSM(data: ComparacionEntrada):
    resultados = []

    # Gauss-Seidel
    start = time.time()
    gs_result = gauss_seidel_method(GaussSeidelParams(**data.dict()))
    tiempo = (time.time() - start) * 1000
    resultados.append(ComparacionResultado(
        metodo="Gauss-Seidel",
        iteraciones=len(gs_result.iterations),
        error_final=gs_result.iterations[-1].error,
        radio_espectral=gs_result.spectral_radius,
        converge=gs_result.converges,
        tiempo_ms=tiempo
    ))

    # Jacobi
    start = time.time()
    jacobi_result = jacobi_method(JacobiParams(**data.dict()))
    tiempo = (time.time() - start) * 1000
    resultados.append(ComparacionResultado(
        metodo="Jacobi",
        iteraciones=len(jacobi_result.iterations),
        error_final=jacobi_result.iterations[-1].error,
        radio_espectral=jacobi_result.spectral_radius,
        converge=jacobi_result.converges,
        tiempo_ms=tiempo
    ))

    # SOR
    start = time.time()
    sor_result = sor_method(SORParams(
        matrix_a=data.matrix_a,
        vector_b=data.vector_b,
        x0=data.x0,
        tol=data.tol,
        niter=data.niter,
        relaxation_factor=data.relaxation_factor
    ))
    tiempo = (time.time() - start) * 1000
    resultados.append(ComparacionResultado(
        metodo=f"SOR (ω={data.relaxation_factor})",
        iteraciones=len(sor_result.iterations),
        error_final=sor_result.iterations[-1].error,
        radio_espectral=sor_result.spectral_radius,
        converge=sor_result.converges,
        tiempo_ms=tiempo
    ))

    return resultados


@router.post(
    "/comparisonLSM",
    response_model=List[ComparacionResultado],
    responses={
        200: {"model": List[ComparacionResultado]},
        **responses,
    },
)
def get_comparisonLSM_params(params: ComparacionEntrada) -> List[ComparacionResultado]:
    try:
        solution = comparisonLSM(params)
        return solution
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Cannot find comparison with the given parameters",
                "error": str(e),
            },
        )