from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/scan", tags=["scan"])


class ScanRequest(BaseModel):
    crm_type: str
    access_token: str
    tenant_id: str


class Signal(BaseModel):
    id: str
    name: str
    value: float
    weight: float
    threshold: float
    status: str
    description: str


class RevivalForecast(BaseModel):
    potential: float
    probability: float
    timeframe: str


class ScanResult(BaseModel):
    scan_id: str
    pipeline_health: float
    revenue_at_risk: float
    zombie_deals: int
    integrity_score: float
    confidence_index: float
    total_deals: int
    signals: List[Signal]
    revival_forecast: RevivalForecast
    created_at: datetime


@router.post("/run")
async def run_scan(request: ScanRequest) -> dict:
    """
    Trigger a Vanguard scan of the connected CRM.
    Returns a scan_id to poll for results.
    """
    # TODO: Implement actual Vanguard scan logic
    # For now, return mock scan_id
    scan_id = f"scan_{datetime.now().timestamp()}"

    return {
        "scan_id": scan_id,
        "status": "processing",
        "estimated_completion": "90s"
    }


@router.get("/{scan_id}/results")
async def get_scan_results(scan_id: str) -> ScanResult:
    """
    Retrieve results for a completed scan.
    """
    # TODO: Implement actual result retrieval from database
    # For now, return mock data

    mock_result = ScanResult(
        scan_id=scan_id,
        pipeline_health=68.0,
        revenue_at_risk=847000.0,
        zombie_deals=23,
        integrity_score=72.0,
        confidence_index=0.91,
        total_deals=127,
        signals=[
            Signal(
                id="stalled_deals",
                name="Stalled Deals",
                value=23.0,
                weight=0.35,
                threshold=15.0,
                status="warning",
                description="Deals that have exceeded expected stage velocity by 2x"
            ),
            Signal(
                id="ownership_gaps",
                name="Ownership Gaps",
                value=8.0,
                weight=0.25,
                threshold=5.0,
                status="danger",
                description="High-value opportunities without assigned owners"
            ),
            Signal(
                id="missing_activities",
                name="Missing Follow-ups",
                value=45.0,
                weight=0.20,
                threshold=20.0,
                status="warning",
                description="Deals without contact activity in past 14 days"
            ),
            Signal(
                id="task_compliance",
                name="Task Compliance",
                value=78.0,
                weight=0.20,
                threshold=85.0,
                status="success",
                description="Percentage of required tasks completed on time"
            )
        ],
        revival_forecast=RevivalForecast(
            potential=520000.0,
            probability=0.68,
            timeframe="45-60 days"
        ),
        created_at=datetime.now()
    )

    return mock_result


@router.get("/{scan_id}/status")
async def get_scan_status(scan_id: str) -> dict:
    """
    Check the status of a running scan.
    """
    # TODO: Implement actual status checking
    return {
        "scan_id": scan_id,
        "status": "completed",
        "progress": 100
    }
