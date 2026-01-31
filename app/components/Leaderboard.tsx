'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  instagram: string;
  amount: number;
  date: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      } else {
        setError(data.error || 'Không thể tải bảng xếp hạng');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tự động load khi component mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gray-300';
    if (rank === 2) return 'bg-gray-300';
    if (rank === 3) return 'bg-gray-300';
    return 'bg-gray-300';
  };

  const getRankShadow = (rank: number) => {
    if (rank === 1) return '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)';
    if (rank === 2) return '6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.8)';
    if (rank === 3) return '5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.8)';
    return 'inset 3px 3px 6px rgba(163, 177, 198, 0.4), inset -3px -3px 6px rgba(255, 255, 255, 0.5)';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
          <span className="text-green-500">■</span> Field Reports
        </h3>
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="px-3 py-1 bg-purple-600 bg-opacity-40 backdrop-blur-md text-purple-200 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 border border-purple-400 border-opacity-30"
          style={{
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }
          }}
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-purple-500 border-opacity-30" style={{
        boxShadow: '0 1px 3px rgba(168, 85, 247, 0.2)'
      }}></div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block text-3xl"
          >
            ⚙️
          </motion.div>
          <p className="text-green-500 mt-2 text-xs font-bold uppercase tracking-wider">Loading Data...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-orange-900 bg-opacity-20 backdrop-blur-sm rounded border border-orange-600 border-opacity-30 p-4">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span>⚠</span> {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leaderboard.length === 0 && (
        <div className="text-center py-6 bg-slate-900 bg-opacity-30 backdrop-blur-sm rounded border border-slate-700 border-opacity-30">
          <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">No Entries Yet</p>
        </div>
      )}

      {/* Leaderboard List */}
      {!loading && !error && leaderboard.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(34, 197, 94, 0.5) rgba(15, 23, 42, 0.5)'
        }}>
          {leaderboard.slice(0, 5).map((entry, index) => (
            <motion.div
              key={entry.instagram}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded bg-slate-900 bg-opacity-50 backdrop-blur-lg border border-green-700 border-opacity-30 transition-all hover:border-opacity-50 relative overflow-hidden"
              style={{
                boxShadow: index < 3 ? `0 ${8-index*2}px ${24-index*8}px rgba(34, 197, 94, ${0.4-index*0.1}), inset 0 1px 0 rgba(255, 255, 255, ${0.05-index*0.01})` : '0 2px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.02)'
              }}
            >
              {/* Rank badge - Tactical corner */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                <div className="absolute top-1 right-1 transform rotate-45 origin-top-right bg-green-700 bg-opacity-30 w-16 h-6 flex items-center justify-center">
                  <span className="text-green-400 font-black text-xs transform -rotate-45">
                    #{index + 1}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {/* Instagram */}
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-wide text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    @{entry.instagram}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    {entry.date}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right ml-4">
                  <p className="font-black text-lg text-green-400" style={{
                    textShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                  }}>
                    {formatMoney(entry.amount)}
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-slate-800 bg-opacity-60 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Claimed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}