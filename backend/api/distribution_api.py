from fastapi import APIRouter
from analytics.distribution.detect_best_distribution import main as run_distribution

router = APIRouter()

@router.get("/distribution/run")
def run_distribution_endpoint():
    try:
        run_distribution()
        return {"status": "Distribution detection completed successfully"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
