"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../../components/Sidebar'; // Adjusted for src/app/risk-map depth

// 1. Load the Map component only on the client side
const RiskMap = dynamic(() => import('../../components/RiskMap'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 rounded-2xl flex items-center justify-center animate-pulse">
      <p className="text-slate-400 font-medium font-sans">Initializing Geospatial Engine...</p>
    </div>
  )
});

export default function RiskMapPage() {
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    // Simulated delay for the 'Syncing' effect during your demo
    const timer = setTimeout(() => setIsSynced(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Geospatial Risk Intelligence</h2>
            <p className="text-slate-500">
              {isSynced ? "Live Outbreak Risk Heatmap - Kenya" : "Connecting to LSTM Inference Nodes..."}
            </p>
          </header>
          
          {!isSynced ? (
            /* --- YOUR SYNCING UI --- */
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-xl font-semibold text-slate-700">Syncing Metadata</p>
              <p className="text-sm text-slate-400 mt-2">Fetching coordinates and historical surveillance data...</p>
            </div>
          ) : (
            /* --- THE ACTUAL MAP --- */
            <div className="animate-in fade-in zoom-in duration-1000">
               <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-200">
                  <RiskMap />
               </div>
               
               <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-xs uppercase">AI Live</div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>LSTM Spatial Analysis:</strong> High-risk clusters identified in <strong>Nairobi</strong> and <strong>Kisumu</strong> based on projected precipitation and historical case density.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}