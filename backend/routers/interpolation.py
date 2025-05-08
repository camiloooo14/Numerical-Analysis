from typing import Optional, Union

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from InterpolationMethods.lagrange import Lagrange, LagranInt, LagranParams
from InterpolationMethods.newton_int import NewtonInt, NewtonInterpol, NewtonParams
from InterpolationMethods.spline import Spline, SplineParams, get_spline
from InterpolationMethods.vandermonde import VanderInt, Vandermonde, VanderParams

router = APIRouter(
    prefix="/interpolation",
    tags=["interpolation"],
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
    "/splines",
    response_model=Spline,
    responses={
        200: {
            "model": Spline,
        },
        **responses,
    },
)
def get_splines(
    params: SplineParams,
) -> Union[Spline, JSONResponse]:
    try:
        print(params)
        solution = get_spline(params.x, params.y, params.d)
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
    "/Vandermonde",
    response_model=VanderInt,
    responses={
        200: {
            "model": VanderInt,
        },
        **responses,
    },
)
def get_vandermonde(
    params: VanderParams,
) -> Union[VanderInt, JSONResponse]:
    try:
        print(params)
        solution = Vandermonde(params.x, params.y)
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
    "/lagrange",
    response_model=LagranInt,
    responses={
        200: {
            "model": LagranInt,
        },
        **responses,
    },
)
def get_lagrange(
    params: LagranParams,
) -> Union[LagranInt, JSONResponse]:
    try:
        print(params)
        solution = Lagrange(params.x, params.y)
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
    "/newton",
    response_model=NewtonInt,
    responses={
        200: {
            "model": NewtonInt,
        },
        **responses,
    },
)
def get_newton_interpolation(
    params: NewtonParams,
) -> Union[NewtonInt, JSONResponse]:
    try:
        print(params)
        solution = NewtonInterpol(params.x, params.y)
        return solution
    except Exception as e:
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Cannot find roots with the given parameters",
                "error": str(e),
            },
        )
