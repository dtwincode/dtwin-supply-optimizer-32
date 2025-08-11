from fastapi import APIRouter
from analytics.threshold.threshold_bayesian_update import main as run_threshold

router = APIRouter()

@router.get("/threshold/run")
def run_threshold_endpoint():
    try:
        run_threshold()
        return {"status": "Threshold update completed successfully"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
