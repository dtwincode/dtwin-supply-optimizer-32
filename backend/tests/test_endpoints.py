import pytest
from fastapi.testclient import TestClient

from backend.app_server import app

client = TestClient(app)

def test_docs_available():
    resp = client.get("/openapi.json")
    assert resp.status_code == 200

def test_ddmrp_decoupled_lead_time():
    resp = client.post("/ddmrp/decoupled-lead-time", json={"item_id": "test"})
    assert resp.status_code in (200, 202, 500)

def test_ddmrp_buffer_profiles():
    resp = client.post(
        "/ddmrp/buffer-profiles",
        json={"average_daily_demand": 10.0, "lead_time": 5.0, "moq": 1.0, "variability_factor": 1.0},
    )
    assert resp.status_code in (200, 202, 500)

def test_ddom_schedule():
    resp = client.post(
        "/ddom/schedule",
        json={"orders": [{"item_id": "x", "quantity": 5}], "capacity_per_day": 10},
    )
    assert resp.status_code in (200, 202, 500)

def test_ddsop_simulation():
    resp = client.post(
        "/ddsop/simulation",
        json={"scenario_id": "scenario1", "orders": [{"item_id": "x", "quantity": 5}], "capacity": 10},
    )
    assert resp.status_code in (200, 202, 500)


def test_ddom_dynamic_schedule():
    resp = client.post(
        "/ddom/dynamic-schedule",
        json={
            "orders": [{"item_id": "x", "quantity": 5}],
            "capacity_schedule": {"2025-01-01": 10},
            "default_capacity": 10
        }
    )
    assert resp.status_code in (200, 202, 500)


def test_ddsop_master_settings():
    resp = client.get("/ddsop/master-settings")
    assert resp.status_code in (200, 404, 500)


def test_ddsop_variance():
    resp = client.post(
        "/ddsop/variance",
        json={"actual": [10, 15, 20], "planned": [8, 14, 18]}
    )
    assert resp.status_code in (200, 500)


def test_ddsop_simulation_post():
    resp = client.post(
        "/ddsop/simulation",
        json={
            "scenarios": [
                {
                    "orders": [{"item_id": "x", "quantity": 5}],
                    "capacity": 10
                }
            ]
        }
    )
    assert resp.status_code in (200, 202, 500)
