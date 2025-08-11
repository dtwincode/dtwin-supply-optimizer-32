from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Import DDMRP analytics functions
from analytics.ddmrp.decoupled_lead_time import calculate_decoupled_lead_time
from analytics.ddmrp.buffer_profiles import calculate_buffer_profiles
from analytics.ddmrp.dynamic_buffer_adjustments import adjust_buffer_levels
from analytics.ddmrp.net_flow_calculation import calculate_net_flow
from analytics.ddmrp.alerts import generate_alerts


router = APIRouter(prefix="/ddmrp", tags=["ddmrp"])


class DecoupledLeadTimeRequest(BaseModel):
    item_id: str


class DecoupledLeadTimeResponse(BaseModel):
    item_id: str
    decoupled_lead_time: float


@router.post("/decoupled-lead-time", response_model=DecoupledLeadTimeResponse)
def run_decoupled_lead_time(request: DecoupledLeadTimeRequest):
    """Endpoint to calculate decoupled lead time for a given item."""
    try:
        dlt = calculate_decoupled_lead_time(request.item_id)
        return DecoupledLeadTimeResponse(item_id=request.item_id, decoupled_lead_time=dlt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class BufferProfileRequest(BaseModel):
    average_daily_demand: float
    decoupled_lead_time: float
    minimum_order_quantity: float
    variability_factor: float = 1.0


class BufferProfileResponse(BaseModel):
    red_zone: float
    yellow_zone: float
    green_zone: float


@router.post("/buffer-profiles", response_model=BufferProfileResponse)
def run_buffer_profiles(request: BufferProfileRequest):
    """Endpoint to calculate DDMRP buffer profiles (red, yellow, green zones)."""
    try:
        result = calculate_buffer_profiles(
            average_daily_demand=request.average_daily_demand,
            decoupled_lead_time=request.decoupled_lead_time,
            minimum_order_quantity=request.minimum_order_quantity,
            variability_factor=request.variability_factor,
        )
        return BufferProfileResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class BufferAdjustmentRequest(BaseModel):
    item_id: str
    adjustment_factor: float


class BufferAdjustmentResponse(BaseModel):
    item_id: str
    red_zone: float
    yellow_zone: float
    green_zone: float


@router.post("/buffer-adjustments", response_model=BufferAdjustmentResponse)
def run_buffer_adjustments(request: BufferAdjustmentRequest):
    """Endpoint to apply dynamic buffer adjustments for a specific item."""
    try:
        result = adjust_buffer_levels(request.item_id, request.adjustment_factor)
        return BufferAdjustmentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class NetFlowRequest(BaseModel):
    item_id: str
    on_hand: float
    open_supply: float
    qualified_demand: float


class NetFlowResponse(BaseModel):
    item_id: str
    net_flow: float
    color: str


@router.post("/net-flow", response_model=NetFlowResponse)
def run_net_flow(request: NetFlowRequest):
    """Endpoint to calculate the net flow position and color status for an item."""
    try:
        result = calculate_net_flow(
            item_id=request.item_id,
            on_hand=request.on_hand,
            open_supply=request.open_supply,
            qualified_demand=request.qualified_demand,
        )
        return NetFlowResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AlertsResponse(BaseModel):
    alerts: List[Dict[str, Any]]


@router.post("/alerts", response_model=AlertsResponse)
def run_alerts():
    """Endpoint to generate alerts based on net flow status for all items."""
    try:
        alerts = generate_alerts()
        return AlertsResponse(alerts=alerts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
