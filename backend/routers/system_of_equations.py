from typing import Optional, Union

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from methods.gauss_seidel import (GaussSeidelParams, GaussSeidelResult,
                                  gauss_seidel_method)
from methods.jacobi import JacobiParams, JacobiResult, jacobi_method
from methods.sor import SORParams, SORResult, sor_method

router = APIRouter(
    prefix="/system-of-equations",
    tags=["system_of_equations"],
)


class MethodError(BaseModel):
    detail: str
    error: Optional[str] = None


responses = {
    409: {
        "description": "Cannot find roots with the given parameters",
        "model": MethodError,
    },
}


@router.post(
    "/jacobi",
    response_model=JacobiResult,
    responses={
        200: {
            "model": JacobiResult,
        },
        **responses,
    },
)
def jacobi_solver(
    params: JacobiParams,
) -> Union[JacobiResult, JSONResponse]:
    try:
        solution = jacobi_method(params)
        return solution
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Cannot find roots with the given parameters",
                "error": str(e),
            },
        )


# Gauss seidel and SOR


@router.post(
    "/gauss-seidel",
    response_model=GaussSeidelResult,
    responses={
        200: {
            "model": GaussSeidelResult,
        },
        **responses,
    },
)
def gauss_seidel_solver(
    params: GaussSeidelParams,
) -> Union[GaussSeidelResult, JSONResponse]:
    try:
        solution = gauss_seidel_method(params)
        return solution
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Cannot find roots with the given parameters",
                "error": str(e),
            },
        )


@router.post(
    "/sor",
    response_model=SORResult,
    responses={
        200: {
            "model": SORResult,
        },
        **responses,
    },
)
def sor_solver(
    params: SORParams,
) -> Union[SORResult, JSONResponse]:
    try:
        solution = sor_method(params)
        return solution
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Cannot find roots with the given parameters",
                "error": str(e),
            },
        )
