// Frontend service for DDS&OP API endpoints

export async function getMasterSettings() {
  const res = await fetch('/ddsop/master-settings', { method: 'GET' });
  return res.json();
}

export async function upsertMasterSettings(settings: Record<string, any>) {
  const res = await fetch('/ddsop/master-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return res.json();
}

export async function performVarianceAnalysis(actual: number[], planned: number[]) {
  const res = await fetch('/ddsop/variance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actual, planned }),
  });
  return res.json();
}

export async function simulateScenarios(item_id: string, scenarios: any[]) {
  const res = await fetch('/ddsop/simulation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id, scenarios }),
  });
  return res.json();
}
