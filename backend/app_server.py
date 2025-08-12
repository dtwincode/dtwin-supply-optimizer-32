from fastapi import FastAPI
from api import distribution_api, threshold_api, simulation_api, ddmrp_api

app = FastAPI(title="DTWIN Supply Optimizer API", version="1.0")

# Include your API routers
app.include_router(distribution_api.router)
app.include_router(ddmrp_api.router)
app.include_router(threshold_api.router)
app.include_router(simulation_api.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to DTWIN Supply Optimizer API"}
from api import ddom_api, ddsop_api
app.include_router(ddom_api.router)
app.include_router(ddsop_api.router)
