"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', actual: 400, predicted: 420 },
  { month: 'Feb', actual: 300, predicted: 310 },
  { month: 'Mar', actual: 200, predicted: 250 },
  { month: 'Apr', actual: 278, predicted: 400 }, // Predicted surge
  { month: 'May', predicted: 480 },
];

export default function OutbreakChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Malaria Trend Prediction (Kenya)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} />
          <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}