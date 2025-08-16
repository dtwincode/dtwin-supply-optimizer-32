from fastapi import PIRouter

from analytics.safety_stock_simulation import main as run_simulation


router = APIRouter()

@router.get("/simulation/run")
def run_simulation_endpoint():
    try:
        run_simulation()
        return {"status": "Simulation completed successfully"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}

from pydantic import BaseModel
from fastapi import HTTPException

router = APIRouter(prefix="/simulation", tags=["simulation"])

class SimulationResponse(BaseModel):
    status: str
    error: str | None = None

@router.post("/run", response_model=SimulationResponse)
def run_simulation_api() -> SimulationResponse:
    try:
        run_simulation()
        return {"status": "Simulation completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
