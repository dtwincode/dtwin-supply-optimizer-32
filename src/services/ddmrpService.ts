// Frontend service for DDMRP API endpoints
// Provides functions to call backend DDMRP endpoints and return JSON responses.

export async function fetchDecoupledLeadTime(itemId: string) {
  const res = await fetch('/ddmrp/decoupled-lead-time', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id: itemId }),
  });
  return res.json();
}

export async function fetchBufferProfiles(params: {
  item_id: string;
  average_daily_demand: number;
  decoupled_lead_time: number;
  minimum_order_quantity: number;
  variability_factor: number;
}) {
  const res = await fetch('/ddmrp/buffer-profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function adjustBufferLevels(itemId: string, adjustment_factor: number) {
  const res = await fetch('/ddmrp/buffer-adjustments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id: itemId, adjustment_factor }),
  });
  return res.json();
}

export async function fetchNetFlow(params: {
  item_id: string;
  on_hand: number;
  open_supply: number;
  qualified_demand: number;
}) {
  const res = await fetch('/ddmrp/net-flow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch('/ddmrp/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
