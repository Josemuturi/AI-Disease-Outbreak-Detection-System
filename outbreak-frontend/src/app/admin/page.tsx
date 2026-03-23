"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuditLog {
  id: number;
  action: string;
  user: string;
  timestamp: string;
}

interface ModelMetrics {
  accuracy: string;
  auc_score: string;
  val_loss: string;
  last_trained: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) return router.push("/");

      // Role guard: only Administrators may access this page
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== "Administrator") {
          alert("Access denied. This page is for Administrators only.");
          return router.push("/dashboard");
        }
      } catch {
        return router.push("/");
      }
      
      try {
        const [logsRes, metricsRes] = await Promise.all([
          fetch("http://localhost:8001/api/v1/admin/audit-logs", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8001/api/v1/admin/model-metrics", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (logsRes.status === 403 || metricsRes.status === 403) {
            alert("Unauthorized. Administrators only.");
            return router.push("/dashboard");
        }

        if (logsRes.ok && metricsRes.ok) {
          setLogs(await logsRes.json());
          setMetrics(await metricsRes.json());
        }
      } catch (e) {
        console.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 text-white items-center">
            <div className="flex-shrink-0 flex items-center font-bold text-xl">System Administration</div>
            <div className="flex space-x-4">
              <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-800">Back to Dashboard</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Model Metrics Section */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">LSTM Model Performance</h2>
        {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">Validation Accuracy</p>
                    <p className="text-2xl font-bold text-gray-800">{metrics.accuracy}</p>
                </div>
                <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">AUC Score</p>
                    <p className="text-2xl font-bold text-gray-800">{metrics.auc_score}</p>
                </div>
                <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">Validation Loss</p>
                    <p className="text-2xl font-bold text-gray-800">{metrics.val_loss}</p>
                </div>
                <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">Last Trained</p>
                    <p className="text-lg font-bold text-gray-800">{new Date(metrics.last_trained).toLocaleDateString()}</p>
                </div>
            </div>
        )}

        {/* Audit Logs Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">System Audit Trail</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Performed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{log.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded text-xs ${log.user === 'Administrator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {log.user}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
