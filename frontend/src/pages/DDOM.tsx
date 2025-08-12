import React, { useState } from 'react';
import { scheduleCapacity, executeOrders, analyzeVariance, OrderInput } from '../services/ddomService';

const DDOM: React.FC = () => {
  const [scheduleResult, setScheduleResult] = useState<any[]>([]);
  const [executeResult, setExecuteResult] = useState<any[]>([]);
  const [varianceResult, setVarianceResult] = useState<any>(null);

  const sampleOrders: OrderInput[] = [
    { item_id: 'item1', quantity: 100 },
    { item_id: 'item2', quantity: 200 },
  ];

  const handleSchedule = async () => {
    const res = await scheduleCapacity(sampleOrders, 150);
    setScheduleResult(res.schedule || res);
  };

  const handleExecute = async () => {
    const res = await executeOrders(sampleOrders);
    setExecuteResult(res || []);
  };

  const handleVariance = async () => {
    const res = await analyzeVariance([100, 120, 130, 110, 90]);
    setVarianceResult(res);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DDOM Dashboard</h1>
      <div className="space-x-4 mb-4">
        <button
          onClick={handleSchedule}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Schedule Capacity
        </button>
        <button
          onClick={handleExecute}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Execute Orders
        </button>
        <button
          onClick={handleVariance}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Analyze Variance
        </button>
      </div>
      {scheduleResult && scheduleResult.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Schedule Result</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(scheduleResult, null, 2)}
          </pre>
        </div>
      )}
      {executeResult && executeResult.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Execution Result</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(executeResult, null, 2)}
          </pre>
        </div>
      )}
      {varianceResult && (
        <div className="mb-4">
          <h2 className="font-semibold">Variance Analysis</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(varianceResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DDOM;
