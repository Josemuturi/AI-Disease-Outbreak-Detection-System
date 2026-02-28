"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function HealthDataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/health-data');
        const json = await response.json();
        setData(json);
        // Small delay to make the "Syncing" animation feel real for the demo
        setTimeout(() => setLoading(false), 800);
      } catch (error) {
        console.error("❌ Error fetching health data:", error);
        setLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Health Data Repository</h2>
          <p className="text-slate-500 mb-8">
            {loading ? "Establishing connection to the AI Outbreak Backend..." : "Live surveillance data from LSTM inference engine"}
          </p>
          
          {loading ? (
            // --- YOUR ORIGINAL LOADING UI ---
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-slate-700">Syncing Metadata</p>
              <p className="text-sm text-slate-400">Fetching coordinates and historical surveillance data</p>
            </div>
          ) : (
            // --- NEW LIVE DATA TABLE ---
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">County</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Cases</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rainfall</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row: any) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">{row.county}</td>
                      <td className="p-4 text-slate-600">{row.cases}</td>
                      <td className="p-4 text-slate-600">{row.rainfall}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.status === 'Critical' ? 'bg-red-100 text-red-600' : 
                          row.status === 'Warning' ? 'bg-amber-100 text-amber-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}