import React from 'react';
import { TeamData, StockPosition } from '../types';
import { X, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface StockModalProps {
  team: TeamData | null;
  onClose: () => void;
}

export const StockModal: React.FC<StockModalProps> = ({ team, onClose }) => {
  if (!team) return null;

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return '-';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-dark-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-dark-800 border border-white/10 flex items-center justify-center text-xl font-bold text-gray-400">
                    {team.teamName.substring(0, 1)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{team.teamName}</h2>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white">RANK #{team.rank}</span>
                        <span>•</span>
                        <span className={team.plPercentage && team.plPercentage >= 0 ? 'text-green-400' : 'text-red-400'}>
                             {team.plPercentage !== null ? `${team.plPercentage}% Total P/L` : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-dark-950/50">
            <div className="bg-dark-800/50 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs uppercase tracking-wider font-bold">
                    <DollarSign size={14} /> Total Money Deployed
                </div>
                <div className="text-xl font-mono font-bold text-white">
                    {formatCurrency(team.totalMoneyDeployed)}
                </div>
            </div>
            <div className="bg-dark-800/50 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs uppercase tracking-wider font-bold">
                    <PieChart size={14} /> Current NAV
                </div>
                <div className="text-xl font-mono font-bold text-white">
                    {formatCurrency(team.currentNav)}
                </div>
            </div>
             <div className="bg-dark-800/50 border border-white/5 p-4 rounded-xl hidden md:block">
                <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs uppercase tracking-wider font-bold">
                    <TrendingUp size={14} /> Stock Count
                </div>
                <div className="text-xl font-mono font-bold text-white">
                    {team.stocks.length}
                </div>
            </div>
        </div>

        {/* Stock Table */}
        <div className="flex-1 overflow-y-auto p-0">
            {team.stocks.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    No stock positions found for this team.
                </div>
            ) : (
                <div className="w-full text-left border-collapse">
                    <div className="sticky top-0 bg-dark-900 z-10 grid grid-cols-12 gap-4 px-6 py-3 border-y border-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4 md:col-span-3">Stock</div>
                        <div className="col-span-3 md:col-span-2 text-right">Qty</div>
                        <div className="col-span-5 md:col-span-2 text-right">Avg Price</div>
                        <div className="col-span-0 md:col-span-2 text-right hidden md:block">CMP</div>
                        <div className="col-span-0 md:col-span-3 text-right hidden md:block">Value</div>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                        {team.stocks.map((stock, idx) => {
                            return (
                                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                                    <div className="col-span-4 md:col-span-3">
                                        <div className="font-bold text-white text-sm truncate">{stock.name}</div>
                                        {/* Mobile Only Details */}
                                        <div className="md:hidden text-[10px] text-gray-500 mt-1 font-mono">
                                            CMP: {formatCurrency(stock.cmp)}
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-3 md:col-span-2 text-right font-mono text-sm text-gray-300">
                                        {stock.quantity}
                                    </div>
                                    
                                    <div className="col-span-5 md:col-span-2 text-right font-mono text-sm text-gray-300">
                                        {formatCurrency(stock.buyPrice)}
                                    </div>
                                    
                                    <div className="hidden md:block col-span-2 text-right font-mono text-sm text-white">
                                        {formatCurrency(stock.cmp)}
                                    </div>
                                    
                                    <div className="hidden md:block col-span-3 text-right">
                                        <div className="font-mono text-sm text-white font-bold">{formatCurrency(stock.currentValue)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};