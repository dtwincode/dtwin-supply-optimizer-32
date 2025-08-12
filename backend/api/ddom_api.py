from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from analytics.ddom import schedule_capacity, execute_orders, analyze_buffer_variance
import pandas as pd

router = APIRouter(prefix='/ddom', tags=['ddom'])

class Order(BaseModel):
    item_id: int
    quantity: float

class ScheduleRequest(BaseModel):
    orders: List[Order]
    capacity_per_day: float

class ExecuteRequest(BaseModel):
    orders: List[Order]

class VarianceRequest(BaseModel):
    levels: List[float]

class VarianceResponse(BaseModel):
    mean_level: float
    std_dev: float

@router.post('/schedule')
async def run_schedule(req: ScheduleRequest) -> List[Dict[str, Any]]:
    '''Schedule orders based on capacity per day.'''
    try:
        orders_list = [o.dict() for o in req.orders]
        schedule = schedule_capacity(orders=orders_list, capacity_per_day=req.capacity_per_day)
        return schedule
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/execute')
async def run_execute(req: ExecuteRequest) -> List[Dict[str, Any]]:
    '''Execute orders by updating their status.'''
    try:
        orders_list = [o.dict() for o in req.orders]
        result = execute_orders(orders=orders_list)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/variance', response_model=VarianceResponse)
async def compute_variance(req: VarianceRequest) -> VarianceResponse:
    '''Compute mean and standard deviation for buffer levels.'''
    try:
        df = pd.DataFrame({'level': req.levels})
        result = analyze_buffer_variance(df)
        return VarianceResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
