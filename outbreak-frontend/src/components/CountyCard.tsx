"use client";
import { useEffect, useState } from "react";
import HistoricalTrendChart from "./HistoricalTrendChart";

interface County {
  county_id:number; county_name:string;
  risk_score:number; prediction_date:string;
  disease_type:string;
}

function RiskBadge({ score }:{ score:number }) {
  const level=
    score>=70 ? {label:"HIGH RISK",bg:"bg-red-100",  text:"text-red-700",  border:"border-red-400"  }
  : score>=40 ? {label:"MODERATE", bg:"bg-amber-100",text:"text-amber-700",border:"border-amber-400"}
  :             {label:"LOW RISK", bg:"bg-green-100",text:"text-green-700",border:"border-green-400"};
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border
                      ${level.bg} ${level.text} ${level.border}`}>
      {level.label}
    </span>
  );
}

export default function CountyDashboard() {
  const [counties,setCounties]=useState<County[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [expandedCountyId, setExpandedCountyId] = useState<number | null>(null);

  const fetchCounties=async()=>{
    try {
      const token=localStorage.getItem("jwt_token");
      const res=await fetch("http://localhost:8001/api/v1/counties",{
        headers:{Authorization:`Bearer ${token}`}});
      if(!res.ok) throw new Error(`API error ${res.status}`);
      setCounties(await res.json());
    } catch(e:unknown){
      setError(e instanceof Error?e.message:"Unknown error");
    } finally { setLoading(false); }
  };

  useEffect(()=>{
    fetchCounties();
    const interval=setInterval(fetchCounties,5*60*1000); // refresh every 5 min
    return()=>clearInterval(interval);
  },[]);

  if(loading) return <p className="text-center py-8">Loading risk data...</p>;
  if(error)   return <p className="text-red-600 text-center">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        County Outbreak Risk Dashboard
      </h1>
      <div className="mb-4 flex gap-4 text-sm text-gray-500">
        <span><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"/>
          Low (0–39%)</span>
        <span><span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1"/>
          Moderate (40–69%)</span>
        <span><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"/>
          High (70–100%)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {counties.map((c)=>(
          <div key={c.county_id}
               onClick={() => setExpandedCountyId(expandedCountyId === c.county_id ? null : c.county_id)}
               className={`bg-white rounded-xl shadow p-5 border border-gray-100
                          hover:shadow-md transition-all cursor-pointer hover:border-blue-300
                          ${expandedCountyId === c.county_id ? "col-span-1 sm:col-span-2 lg:col-span-3 ring-2 ring-blue-500" : ""}`}>
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-semibold text-gray-800">{c.county_name}</h2>
              <RiskBadge score={c.risk_score}/>
            </div>
            <p className="text-4xl font-bold text-blue-900">
              {c.risk_score.toFixed(1)}%
            </p>
            {c.disease_type !== "None" && (
                <p className="text-sm font-semibold text-red-600 mt-1">
                    Warning: {c.disease_type}
                </p>
            )}
            <div className="flex justify-between items-end mt-2">
              <p className="text-xs text-gray-400">
                Predicted: {new Date(c.prediction_date).toLocaleString("en-KE")}
              </p>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {expandedCountyId === c.county_id ? "Close Details ▲" : "View Trend Data ▼"}
              </span>
            </div>
            
            {expandedCountyId === c.county_id && (
              <HistoricalTrendChart countyName={c.county_name} currentRisk={c.risk_score} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
