from fastapi import APIRouter
from analytics.distribution.detect_best_distribution import main as run_distribution

router = APIRouter(

@router.get("/distribution/run")
def run_distribution_endpoint():
    try:
        run_distribution()
        return {"status": "Distribution detection completed successfully"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


from pydantic import BaseModel
from fastapi import HTTPException

# redefine router with prefix and tags
router = APIRouter(prefix="/distribution", tags=["distribution"])

class DistributionResponse(BaseModel):
    status: str
    error: str | None = None

@router.post("/run", response_model=DistributionResponse)
def run_distribution_api() -> DistributionResponse:
    try:
        run_distribution()
        return {"status": "Distribution detection completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
