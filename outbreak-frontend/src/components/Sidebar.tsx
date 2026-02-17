import Link from 'next/link';
import { 
  LayoutDashboard, 
  Map, 
  Database, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react'; // These are standard, clean icons

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-6 fixed flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-10">
          <Activity className="text-blue-400 w-8 h-8" />
          <h1 className="text-2xl font-bold text-blue-400">Outbreak AI</h1>
        </div>
        
        <nav className="space-y-2">
          <Link href="/" className="flex items-center p-3 bg-blue-600 rounded-lg transition-colors cursor-pointer">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/risk-map" className="flex items-center p-3 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white">
            <Map className="w-5 h-5 mr-3" />
            <span>Risk Map</span>
          </Link>
          
          <Link href="/health-data" className="flex items-center p-3 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white">
            <Database className="w-5 h-5 mr-3" />
            <span>Health Data</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-800">
             <Link href="/settings" className="flex items-center p-3 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center p-3 text-slate-400 hover:text-red-400 cursor-pointer transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </div>
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg text-xs">
          <p className="text-slate-500">System Status</p>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-slate-300">Backend Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}