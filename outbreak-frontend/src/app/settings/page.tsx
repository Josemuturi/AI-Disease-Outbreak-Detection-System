import Sidebar from '../../components/Sidebar';
export default function SubPage() {
  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Initialized</h2>
          <p className="text-slate-500 mb-8">Establishing connection to the AI Outbreak Backend...</p>
          
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-slate-700">Syncing Metadata</p>
            <p className="text-sm text-slate-400">Fetching coordinates and historical surveillance data</p>
          </div>
        </div>
      </div>
    </main>
  );
}