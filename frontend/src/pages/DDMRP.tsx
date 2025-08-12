import React, { useState } from 'react';
import {
  fetchDecoupledLeadTime,
  fetchAlerts,
} from '../services/ddmrpService';

const DDMRP: React.FC = () => {
  const [dlt, setDlt] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  const handleFetchDLT = async () => {
    try {
      const res = await fetchDecoupledLeadTime('item1');
      setDlt(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadAlerts = async () => {
    try {
      const res = await fetchAlerts();
      if (Array.isArray(res.alerts)) {
        setAlerts(res.alerts);
      } else if (Array.isArray(res)) {
        setAlerts(res);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DDMRP Dashboard</h1>
      <div className="space-x-4">
        <button
          onClick={handleFetchDLT}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Get Decoupled Lead Time
        </button>
        <button
          onClick={handleLoadAlerts}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Load Alerts
        </button>
      </div>
      {dlt && (
        <div className="mt-4">
          <h2 className="font-semibold">Decoupled Lead Time</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(dlt, null, 2)}
          </pre>
        </div>
      )}
      {alerts.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Alerts</h2>
          <ul className="list-disc list-inside">
            {alerts.map((alert, idx) => (
              <li key={idx}>
                {typeof alert === 'string' ? alert : JSON.stringify(alert)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DDMRP;
