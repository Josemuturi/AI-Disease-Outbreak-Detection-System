"use client";
import { useState } from 'react';

export default function ReportButton() {
  const [report, setReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/generate-report');
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("❌ Report Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400"
      >
        {isGenerating ? "AI Processing..." : "Generate Report"}
      </button>

      {/* MODAL POPUP */}
      {report && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Intelligence Summary</h3>
              <span className="text-xs font-mono text-slate-400">{report.report_id}</span>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              {report.summary}
            </p>

            <div className="flex gap-4">
              <button onClick={() => setReport(null)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold">
                Close
              </button>
              <button onClick={() => window.print()} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}