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

from pydantic import BaseModel
from fastapi import HTTPException

router = APIRouter(prefix="/threshold", tags=["threshold"])

class ThresholdResponse(BaseModel):
    status: str
    error: str | None = None

@router.post("/ThresholdResponse", response_model=ThresholdResponse)
def run_threshold_api() -> ThresholdResponse:
    try:
        run_threshold()

        # Corrected RESTful router and response model
router = APIRouter(prefix="/threshold", tags=["threshold"])

class ThresholdResponseModel(BaseModel):
    status: str
    error: str | None = None

@router.post("/run", response_model=ThresholdResponseModel)
def run_threshold_api_corrected() -> ThresholdResponseModel:
    try:
        run_threshold()
        return {"status": "Threshold update completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
return {"status": "Threshold update completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
