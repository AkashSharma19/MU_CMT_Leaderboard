import React from 'react';
import { TeamData } from '../types';
import { Trophy, Medal, ChevronRight } from 'lucide-react';

interface LeaderboardTableProps {
  data: TeamData[];
  onTeamClick?: (team: TeamData) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data, onTeamClick }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-dark-900/40">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <div className="col-span-2 sm:col-span-1">Rank</div>
        <div className="col-span-6 sm:col-span-5">Team Name</div>
        <div className="col-span-4 sm:col-span-6 text-right">P/L %</div>
      </div>

      <div className="divide-y divide-white/5">
        {data.map((team) => (
          <div 
            key={team.teamName} 
            onClick={() => onTeamClick && onTeamClick(team)}
            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all hover:bg-white/5 cursor-pointer group ${team.rank <= 3 ? 'bg-white/[0.02]' : ''}`}
          >
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 font-mono text-gray-300">
              {team.rank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
              {team.rank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
              {team.rank === 3 && <Medal className="w-4 h-4 text-orange-600" />}
              <span className={team.rank <= 3 ? 'font-bold text-white' : ''}>{team.rank}</span>
            </div>
            
            <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-dark-800 flex items-center justify-center text-xs font-bold text-gray-500 border border-white/10 group-hover:border-white/20 transition-colors">
                {team.teamName.substring(0, 1)}
              </div>
              <span className="font-medium text-gray-200 truncate group-hover:text-white transition-colors">{team.teamName}</span>
            </div>

            <div className="col-span-4 sm:col-span-6 flex items-center justify-end gap-3">
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1">
                {team.plPercentage !== null ? (
                    <span className={`font-mono font-bold text-lg ${team.plPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {team.plPercentage > 0 ? '+' : ''}{team.plPercentage}%
                    </span>
                ) : (
                    <span className="font-mono text-gray-500 text-lg">
                    -
                    </span>
                )}
              </div>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors hidden sm:block opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        ))}

        {data.length === 0 && (
            <div className="p-8 text-center text-gray-500">No data found.</div>
        )}
      </div>
    </div>
  );
};