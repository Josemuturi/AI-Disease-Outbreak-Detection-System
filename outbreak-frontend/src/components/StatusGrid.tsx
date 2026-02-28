"use client";
import { useEffect, useState } from 'react';

export default function StatusGrid() {
  // 1. Initialize state with "Loading" or "0" values
  const [data, setData] = useState({
    active_outbreaks: 0,
    high_risk_count: 0,
    ai_accuracy: "0%",
  });

  // 2. Fetch from your Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/dashboard-stats');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("❌ Failed to fetch AI stats:", error);
      }
    };
    fetchData();
  }, []);

  // 3. Map the dynamic data to your UI layout
  const stats = [
    { label: "Active Outbreaks", value: data.active_outbreaks, color: "text-red-600" },
    { label: "High Risk Counties", value: data.high_risk_count, color: "text-orange-500" },
    { label: "AI Prediction Accuracy", value: data.ai_accuracy, color: "text-green-600" }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">{s.label}</p>
          <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}