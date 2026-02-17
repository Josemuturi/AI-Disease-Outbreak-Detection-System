const stats = [
  { label: 'Total High-Risk Counties', value: '04', color: 'text-red-600' },
  { label: 'Prediction Accuracy (LSTM)', value: '92.4%', color: 'text-green-600' },
  { label: 'Data Sync Status', value: 'Active', color: 'text-blue-600' },
];

export default function StatusGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">{s.label}</p>
          <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}