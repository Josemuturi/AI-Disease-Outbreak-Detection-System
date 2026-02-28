import Sidebar from '../components/Sidebar';
import StatusGrid from '../components/StatusGrid';
import OutbreakChart from '../components/OutbreakChart';
import ReportButton from '../components/ReportButton';
export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
            <p className="text-slate-500">Early Warning Status: Monitoring 47 Counties</p>
          </div>
          <ReportButton className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Generate Report
          </ReportButton>
        </header>

        <StatusGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OutbreakChart />
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Explainable AI (XAI) Factors</h3>
            <p className="text-sm text-slate-600 mb-4 italic">Why is a surge predicted for April?</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm border-b pb-2">
                <span>Rainfall Spike (Meteorological)</span>
                <span className="text-red-500 font-bold">+42% Influence</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b pb-2">
                <span>Google Search: "Malaria Symptoms"</span>
                <span className="text-orange-500 font-bold">+18% Influence</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}