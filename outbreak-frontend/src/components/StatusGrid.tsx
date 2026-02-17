export default function StatusGrid() {
  const stats = [
    { label: "Active Outbreaks", value: "12", color: "text-red-600" },
    { label: "High Risk Counties", value: "5", color: "text-orange-500" },
    { label: "AI Prediction Accuracy", value: "94.2%", color: "text-green-600" }
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