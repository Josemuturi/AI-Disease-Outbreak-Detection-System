"use client";
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Determine if we are currently in dark mode
  const isDark = theme === 'dark';

  return (
    // The "transition-colors duration-500" is the secret for the smooth fade
    <main className={`flex min-h-screen transition-colors duration-500 ease-in-out ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Pass the theme to the Sidebar so it can adjust its borders/colors */}
      <Sidebar theme={theme} />
      
      <div className="ml-64 p-8 w-full">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Customize your Outbreak AI interface for Thika operations.
            </p>
          </header>

          <section className={`p-8 rounded-3xl border transition-all duration-500 ${
            isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xl font-bold mb-6">Appearance</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Option */}
              <button 
                onClick={() => toggleTheme('light')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  !isDark ? 'border-blue-600 bg-blue-50/50' : 'border-transparent bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="p-3 bg-white shadow-sm rounded-full text-amber-500">
                  <Sun size={24} />
                </div>
                <span className="font-bold text-sm">Light Mode</span>
              </button>

              {/* Dark Mode Option */}
              <button 
                onClick={() => toggleTheme('dark')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  isDark ? 'border-blue-600 bg-blue-900/20' : 'border-transparent bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <div className="p-3 bg-slate-950 shadow-sm rounded-full text-blue-400">
                  <Moon size={24} />
                </div>
                <span className="font-bold text-sm">Dark Mode</span>
              </button>
            </div>
          </section>

          <footer className="mt-12 pt-6 border-t border-slate-200/10">
            <p className="text-xs text-slate-500 font-mono">
              System Version: 2.0.4-stable | Node: {theme.toUpperCase()}
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}