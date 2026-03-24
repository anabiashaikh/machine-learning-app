import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../config';

const useAlertPolling = (enabled = true, intervalMs = 15000) => {
  const seenAlertIds = useRef(new Set());
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts`);
        if (!response.ok) return;
        const data = await response.json();
        const alerts = data.alerts || [];

        // Check for new critical alerts
        const newCriticalAlerts = [];
        alerts.forEach(alert => {
          if (alert.severity === 'critical' && !seenAlertIds.current.has(alert.id)) {
            seenAlertIds.current.add(alert.id);
            newCriticalAlerts.push(alert);
          }
        });

        // Don't toast on the very first load to avoid a barrage of old alerts,
        // unless you want to notify them immediately of existing criticals.
        if (!initialLoad.current) {
          newCriticalAlerts.forEach(alert => {
             toast.error(`⚠️ URGENT: Machine ${alert.machineId} needs immediate repair!\nIssue: ${alert.issue}`, {
               duration: 8000,
               position: 'top-right',
               style: {
                 background: '#1e293b',
                 color: '#f87171',
                 border: '1px solid #ef4444',
               },
             });
          });
        }
        initialLoad.current = false;
        
      } catch (error) {
        console.error("Alert polling failed:", error);
      }
    };

    fetchAlerts(); // Initial call
    const intervalId = setInterval(fetchAlerts, intervalMs);

    return () => clearInterval(intervalId);
  }, [enabled, intervalMs]);
};

export default useAlertPolling;
