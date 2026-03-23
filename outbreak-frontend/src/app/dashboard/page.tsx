"use client";
import { useEffect, useState } from "react";
import CountyDashboard from "@/components/CountyCard";
import RiskMap from "@/components/RiskMap";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    } catch {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 text-white items-center">
            <div className="flex-shrink-0 flex items-center font-bold text-xl">
              Outbreak Surveillance System
            </div>
            <div className="flex space-x-4">
              <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-800">Dashboard</a>
              <a href="/alerts" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Alerts</a>
              <a href="/reports" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Reports</a>
              {role === "Administrator" && (
                <a href="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-800 text-purple-200">Admin Portal</a>
              )}
              <button
                onClick={() => { localStorage.removeItem("jwt_token"); router.push("/"); }}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <CountyDashboard />
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-6 md:px-0">Geospatial Risk Outlook</h2>
            <RiskMap />
        </div>
      </main>
    </div>
  );
}

