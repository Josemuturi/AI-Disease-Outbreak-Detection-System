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
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:bg-blue-400"
      >
        {isGenerating ? "AI Processing..." : "Generate Report"}
      </button>

      {/* MODAL POPUP */}
      {report && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Outbreak Alert</p>
                {/* 1. Displaying the Disease Name */}
                <h2 className="text-3xl font-black text-slate-900">{report.disease}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">{report.report_id}</span>
                {/* 2. Displaying the Confidence Score */}
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                  {report.confidence} Accuracy
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <p className="text-slate-700 leading-relaxed text-sm">
                {report.summary}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setReport(null)} 
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Dismiss
              </button>
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}