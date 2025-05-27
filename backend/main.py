from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import interpolation, roots, system_of_equations, comparison, root_comparison

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roots.router)
app.include_router(interpolation.router)
app.include_router(system_of_equations.router)
app.include_router(comparison.router)
app.include_router(root_comparison.router)

#C:\Users\sarii\AppData\Roaming\Python\Python313\Scripts\uvicorn main:app --reload