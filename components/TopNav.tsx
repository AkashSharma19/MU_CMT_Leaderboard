import React from 'react';
import { Search, Bell, Globe } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <header className="h-20 border-b border-white/5 bg-dark-950 flex items-center px-8 sticky top-0 z-40 gap-8">
      {/* Branding */}
      <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white text-black p-1 rounded font-bold tracking-widest text-xs border border-white">TETR</div>
          <span className="text-white font-bold text-xl">DASH</span>
      </div>

      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Type to search..." 
            className="w-full bg-dark-800 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
             <span className="text-[10px] text-gray-500 border border-gray-700 rounded px-1">CTRL + K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="hidden lg:flex items-center gap-2 text-gray-400 text-xs">
            <Globe size={14} />
            <span>Your Timezone (+04:00) Dubai, Asia</span>
        </div>
        
        <div className="relative">
          <Bell className="text-gray-400 hover:text-white cursor-pointer transition-colors" size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white/20"></div>
      </div>
    </header>
  );
};