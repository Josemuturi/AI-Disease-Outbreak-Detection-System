'use client';
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const data = [
  { month: 'Jan', actual: 120, predicted: 115 },
  { month: 'Feb', actual: 150, predicted: 145 },
  { month: 'Mar', actual: 180, predicted: 190 },
  { month: 'Apr', actual: 170, predicted: 220 }, // AI predicts a surge here
  { month: 'May', predicted: 260 }, // Future forecast
];

const OutbreakChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Infection Trend Analysis</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          AI Model: LSTM
        </span>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              dot={{ r: 4 }} 
              activeDot={{ r: 8 }} 
              name="Actual Cases"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#ef4444" 
              strokeWidth={4} 
              strokeDasharray="8 5" 
              dot={{ r: 4 }} 
              name="AI Prediction"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OutbreakChart;