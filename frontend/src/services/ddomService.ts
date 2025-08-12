// Frontend service for DDOM API endpoints

export interface OrderInput {
  item_id: string;
  quantity: number;
}

export async function scheduleCapacity(orders: OrderInput[], capacity_per_day: number) {
  const res = await fetch('/ddom/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orders, capacity_per_day }),
  });
  return res.json();
}

export async function executeOrders(orders: OrderInput[]) {
  const res = await fetch('/ddom/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orders }),
  });
  return res.json();
}

export async function analyzeVariance(levels: number[]) {
  const res = await fetch('/ddom/variance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ levels }),
  });
  return res.json();
}
