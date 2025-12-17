import React, { useState, useEffect } from 'react';
import { Podium } from './components/Podium';
import { LeaderboardTable } from './components/LeaderboardTable';
import { StockModal } from './components/StockModal';
import { fetchSheetData, MOCK_DATA } from './services/sheetService';
import { TeamData } from './types';
import { Settings, Trophy, RefreshCw } from 'lucide-react';

// The Google Sheet published as CSV
const DEFAULT_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmX0o6wDYpFzQbkDcyWC29iftyB-7nabI_Ty-gTLk8-xVgP7CSKiGSm0TfHuGN5gXtt7khnpNCE018/pub?output=csv";

const App: React.FC = () => {
  const [data, setData] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // State for selected team popup
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

  useEffect(() => {
    // Initial load - prefer local storage, otherwise use default official sheet
    const savedUrl = localStorage.getItem('sheet_url');
    const targetUrl = savedUrl || DEFAULT_SHEET_URL;
    
    setSheetUrl(targetUrl);
    handleFetch(targetUrl);
  }, []);

  const handleFetch = async (url: string) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedData = await fetchSheetData(url);
      setData(fetchedData);
      setLastUpdated(new Date());
      // Only save to local storage if it's different from default to keep storage clean
      if (url !== DEFAULT_SHEET_URL) {
        localStorage.setItem('sheet_url', url);
      }
      setIsConfigOpen(false);
    } catch (err) {
      setError('Failed to fetch data. Switching to demo data for display.');
      console.error(err);
      setData(MOCK_DATA); // Fallback to mock data on error so UI isn't empty
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
      localStorage.removeItem('sheet_url');
      setSheetUrl(DEFAULT_SHEET_URL);
      handleFetch(DEFAULT_SHEET_URL);
  };

  const topThree = data.filter(d => d.rank <= 3);
  const restList = data.filter(d => d.rank > 3);

  return (
    <div className="min-h-screen bg-dark-950 font-sans text-gray-200 selection:bg-yellow-500/30 flex flex-col">
      {/* Minimal Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 bg-dark-950/80 backdrop-blur-md">
         <div className="flex items-center gap-3">
             <div className="bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                <Trophy size={20} className="text-yellow-500" />
             </div>
             <div className="flex flex-col">
                <span className="text-white font-bold text-xl tracking-tight leading-none">LEADERBOARD</span>
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">OFFICIAL RANKINGS</span>
             </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
                onClick={() => handleFetch(sheetUrl)}
                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg border border-transparent hover:border-white/10"
                title="Refresh Data"
            >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button 
                  onClick={() => setIsConfigOpen(true)}
                  className="flex items-center gap-2 text-sm bg-dark-800 hover:bg-dark-700 px-4 py-2 rounded-lg border border-white/10 transition-all text-gray-300 hover:text-white"
              >
                  <Settings size={16} />
                  <span className="hidden sm:inline">Data Source</span>
              </button>
         </div>
      </header>

      <main className="p-6 md:p-10 w-full max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Podium Section */}
        <div className="relative mt-4">
             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
             
             {loading && data.length === 0 ? (
                <div className="h-64 flex items-center justify-center flex-col gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                    <p className="text-gray-500 text-sm animate-pulse">Fetching latest rankings...</p>
                </div>
             ) : (
                <Podium topThree={topThree} onTeamClick={setSelectedTeam} />
             )}
        </div>

        {/* Table Section */}
        <div className="glass-panel rounded-2xl p-1 relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.03] pointer-events-none"></div>
           <div className="relative z-10 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">All Teams</h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5">
                            {data.length} TEAMS
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} ${loading ? 'animate-ping' : ''}`}></div>
                        {loading ? 'UPDATING...' : `LAST UPDATED: ${lastUpdated.toLocaleTimeString()}`}
                    </div>
                </div>
                <LeaderboardTable 
                    data={loading && data.length === 0 ? [] : restList} 
                    onTeamClick={setSelectedTeam}
                />
           </div>
        </div>

      </main>

      {/* Team Details Modal */}
      {selectedTeam && (
          <StockModal 
            team={selectedTeam} 
            onClose={() => setSelectedTeam(null)} 
          />
      )}

      {/* Config Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dark-900 border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4">Data Source Configuration</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CSV Link</label>
                            <input 
                                type="text" 
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                className="w-full bg-dark-950 border border-white/10 rounded p-2 text-white focus:border-yellow-500 outline-none text-sm font-mono"
                                placeholder="https://docs.google.com/spreadsheets/..."
                            />
                        </div>
                        
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-400 text-xs">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex gap-3 pt-4">
                            <button 
                                onClick={() => handleFetch(sheetUrl)}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Fetching...' : 'Save & Fetch'}
                            </button>
                        </div>
                        
                        <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                             <button 
                                onClick={handleReset}
                                className="text-xs text-yellow-500/70 hover:text-yellow-500 transition-colors"
                            >
                                Use Default Official Sheet
                            </button>
                             <button 
                                onClick={() => setIsConfigOpen(false)}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;