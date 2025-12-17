import React from 'react';
import { TeamData } from '../types';
import { Trophy } from 'lucide-react';

interface PodiumProps {
  topThree: TeamData[];
  onTeamClick?: (team: TeamData) => void;
}

const PodiumItem = ({ team, position, onClick }: { team: TeamData; position: 1 | 2 | 3; onClick?: (t: TeamData) => void }) => {
  if (!team) return null;

  let heightClass = '';
  let colorClass = '';
  let glowClass = '';
  let orderClass = '';
  let medalIconColor = '';

  if (position === 1) {
    heightClass = 'h-64';
    colorClass = 'bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700';
    glowClass = 'glow-gold';
    orderClass = 'order-2 -mt-12 z-10'; // Center and highest
    medalIconColor = 'text-yellow-400';
  } else if (position === 2) {
    heightClass = 'h-48';
    colorClass = 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500';
    glowClass = 'glow-silver';
    orderClass = 'order-1';
    medalIconColor = 'text-gray-300';
  } else {
    heightClass = 'h-40';
    colorClass = 'bg-gradient-to-b from-orange-300 via-orange-500 to-orange-800';
    glowClass = 'glow-bronze';
    orderClass = 'order-3';
    medalIconColor = 'text-orange-400';
  }

  return (
    <div 
        className={`flex flex-col items-center justify-end w-1/3 ${orderClass} transition-all duration-500 hover:scale-105 cursor-pointer group`}
        onClick={() => onClick && onClick(team)}
    >
      {/* Avatar/Name Card */}
      <div className="mb-4 text-center">
         <div className="relative inline-block mb-2">
            <div className={`w-16 h-16 rounded-full border-2 border-white/10 bg-dark-800 flex items-center justify-center text-xl font-bold ${medalIconColor} group-hover:border-white/30 transition-colors`}>
                {team.teamName.substring(0, 2).toUpperCase()}
            </div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                {position === 1 && <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400" />}
            </div>
         </div>
         <h3 className="text-white font-bold text-lg truncate max-w-[120px] sm:max-w-[160px] group-hover:text-yellow-500 transition-colors">{team.teamName}</h3>
         {team.plPercentage !== null ? (
            <p className={`text-sm font-mono flex items-center justify-center gap-1 ${team.plPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {team.plPercentage}%
            </p>
         ) : (
            <p className="text-sm font-mono text-gray-500">-</p>
         )}
      </div>

      {/* The Pillar */}
      <div className={`w-full max-w-[140px] rounded-t-lg relative ${heightClass} ${glowClass}`}>
        {/* Front Face Gradient */}
        <div className={`absolute inset-0 opacity-90 rounded-t-lg ${colorClass}`}></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-t-lg"></div>

        {/* Rank Number */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/90 font-black text-4xl drop-shadow-md">
            {position}
        </div>
      </div>
    </div>
  );
};

export const Podium: React.FC<PodiumProps> = ({ topThree, onTeamClick }) => {
  const first = topThree.find(t => t.rank === 1);
  const second = topThree.find(t => t.rank === 2);
  const third = topThree.find(t => t.rank === 3);

  return (
    <div className="flex items-end justify-center gap-4 sm:gap-8 w-full max-w-2xl mx-auto py-8">
      {second && <PodiumItem team={second} position={2} onClick={onTeamClick} />}
      {first && <PodiumItem team={first} position={1} onClick={onTeamClick} />}
      {third && <PodiumItem team={third} position={3} onClick={onTeamClick} />}
    </div>
  );
};