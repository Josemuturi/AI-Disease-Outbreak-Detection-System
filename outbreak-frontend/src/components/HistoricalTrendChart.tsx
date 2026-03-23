"use client";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// Simulate 60 days of historical data for the chart based on the risk score trend
export default function HistoricalTrendChart({ countyName, currentRisk }: { countyName: string, currentRisk: number }) {
  const data = useMemo(() => {
    const history = [];
    let baseTemp = 24;
    let baseRain = 20;
    let baseCases = currentRisk > 60 ? 5 : 0;

    for (let i = 60; i >= 0; i--) {
      // Simulate rising trends if current risk is high, or stable if low
      const trendFactor = currentRisk / 100;
      const dayFactor = (60 - i) / 60; // 0 to 1 as it approaches today

      const temp = baseTemp + Math.sin(i / 5) * 4 + (trendFactor * dayFactor * 5); 
      const rain = Math.max(0, baseRain + Math.cos(i / 3) * 30 + (trendFactor * dayFactor * 40));
      
      // Cases start low and spike near the end if risk is high
      let cases = baseCases + Math.max(0, Math.pow(dayFactor, 3) * (currentRisk * 2) + (Math.random() * 10 - 5));
      if (cases < 0) cases = 0;

      const d = new Date();
      d.setDate(d.getDate() - i);
      
      history.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Temperature: Math.round(temp),
        Rainfall: Math.round(rain),
        "Predicted Cases": Math.round(cases)
      });
    }
    return history;
  }, [currentRisk]);

  return (
    <div className="w-full h-64 mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-bold text-gray-600 mb-4">{countyName} - 60 Day Epidemiological Trend</h4>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} minTickGap={20} />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
          <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
          
          <Bar yAxisId="right" dataKey="Rainfall" barSize={10} fill="#93C5FD" radius={[2, 2, 0, 0]} name="Rainfall (mm)" />
          <Line yAxisId="left" type="monotone" dataKey="Temperature" stroke="#FBBF24" strokeWidth={2} dot={false} name="Temp (°C)" />
          <Line yAxisId="left" type="monotone" dataKey="Predicted Cases" stroke="#EF4444" strokeWidth={3} dot={false} name="Simulated Cases" activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
