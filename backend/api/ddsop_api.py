from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from analytics.ddsop import (
    get_master_settings,
    upsert_master_settings,
    perform_variance_analysis,
    simulate_ddom_performance,
)
import pandas as pd

router = APIRouter(prefix='/ddsop', tags=['ddsop'])

# Master settings models
class MasterSettings(BaseModel):
    safety_stock_factor: float
    lead_time_factor: float
    # Add other settings fields as needed

@router.get('/master-settings')
async def get_master() -> Dict[str, Any]:
    """Retrieve current DDOM master settings."""
    try:
        settings = get_master_settings()
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/master-settings')
async def upsert_master(settings: Dict[str, Any]) -> Dict[str, Any]:
    """Create or update DDOM master settings."""
    try:
        upsert_master_settings(settings)
        return {'status': 'success'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Variance analysis models
class VarianceAnalysisRequest(BaseModel):
    actual: List[float]
    planned: List[float]

class VarianceAnalysisResponse(BaseModel):
    mean_difference: float
    std_dev_difference: float

@router.post('/variance', response_model=VarianceAnalysisResponse)
async def variance_analysis(req: VarianceAnalysisRequest) -> VarianceAnalysisResponse:
    """Perform variance analysis between actual and planned data."""
    try:
        df = pd.DataFrame({'actual': req.actual, 'planned': req.planned})
        result = perform_variance_analysis(df)
        return VarianceAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Simulation models
class SimulationOrder(BaseModel):
    item_id: int
    quantity: float

class SimulationScenario(BaseModel):
    name: str
    orders: List[SimulationOrder]

class SimulationRequest(BaseModel):
    scenarios: List[SimulationScenario]
    capacity_per_day: float

@router.post('/simulation')
async def run_simulation(req: SimulationRequest) -> List[Dict[str, Any]]:
    """Simulate DDOM performance for multiple scenarios."""
    try:
        demand_data = [
            {'name': scenario.name, 'orders': [order.dict() for order in scenario.orders]}
            for scenario in req.scenarios
        ]
        results = simulate_ddom_performance(demand_data=demand_data, capacity_per_day=req.capacity_per_day)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
