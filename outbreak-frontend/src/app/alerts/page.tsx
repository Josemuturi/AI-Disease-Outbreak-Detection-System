"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Alert {
  alert_id: number;
  county_name: string;
  risk_score: number;
  severity: string;
  status: string;
  date: string;
  disease_type: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) return router.push("/");
      
      try {
        const res = await fetch("http://localhost:8001/api/v1/alerts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setAlerts(await res.json());
        }
      } catch (e) {
        console.error("Failed to load alerts");
      }
    };
    fetchAlerts();
  }, [router]);

  const updateStatus = async (alert_id: number, status: string) => {
    const token = localStorage.getItem("jwt_token");
    await fetch(`http://localhost:8001/api/v1/alerts/${alert_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    // Refresh list locally
    setAlerts(alerts.map(a => a.alert_id === alert_id ? { ...a, status } : a));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 text-white items-center">
            <div className="flex-shrink-0 flex items-center font-bold text-xl">Outbreak Surveillance System</div>
            <div className="flex space-x-4">
              <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Dashboard</a>
              <a href="/alerts" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-800">Alerts</a>
              <a href="/reports" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Reports</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Outbreak Alerts Management</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map(alert => (
                <tr key={alert.alert_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.county_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{alert.disease_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{alert.risk_score}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.severity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(alert.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      className="border rounded p-1 font-bold text-blue-900"
                      value={alert.status}
                      onChange={(e) => updateStatus(alert.alert_id, e.target.value)}
                    >
                      <option value="SENT">Sent</option>
                      <option value="ACKNOWLEDGED">Acknowledged</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
