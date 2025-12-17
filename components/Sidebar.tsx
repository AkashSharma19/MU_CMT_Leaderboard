import React from 'react';
import { Home, BarChart2, Award, Settings, MessageSquare, LogOut, Hexagon } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-dark-950 border-r border-white/5 flex flex-col z-50 transition-all duration-300">
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="bg-white text-black p-1 rounded font-bold tracking-widest text-xs border border-white">TETR</div>
            <span className="text-white font-bold text-xl hidden lg:block">DASH</span>
        </div>
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
        <NavItem icon={<Home size={20} />} label="Dashboard" />
        <NavItem icon={<BarChart2 size={20} />} label="Business Metrics" />
        <NavItem icon={<Award size={20} />} label="Leaderboard" active />
        <NavItem icon={<MessageSquare size={20} />} label="Discussion" />
        <div className="mt-auto"></div>
        <NavItem icon={<Settings size={20} />} label="Resources" />
        <NavItem icon={<LogOut size={20} />} label="Logout" />
      </nav>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-lg transition-all ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    <span className="hidden lg:block font-medium text-sm">{label}</span>
  </button>
);