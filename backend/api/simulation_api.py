from fastapi import APIRouter
from analytics.safety_stock_simulation import main as run_simulation

router = APIRouter()

@router.get("/simulation/run")
def run_simulation_endpoint():
    try:
        run_simulation()
        return {"status": "Simulation completed successfully"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
