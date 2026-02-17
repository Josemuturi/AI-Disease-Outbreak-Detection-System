import { LayoutDashboard, Map as MapIcon, Bell, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-6 flex flex-col fixed">
      <h1 className="text-xl font-bold mb-10 text-blue-400">Secure-Duka AI</h1>
      <nav className="space-y-4">
        <a href="#" className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg">
          <LayoutDashboard size={20} /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
          <MapIcon size={20} /> County Analysis
        </a>
        <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
          <Bell size={20} /> Alerts
        </a>
      </nav>
    </div>
  );
}