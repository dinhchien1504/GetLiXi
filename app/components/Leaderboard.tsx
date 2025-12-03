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
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Top lì xì 
        </h3>
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? '⏳' : 'Reload'}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-200"></div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block text-3xl"
          >
            🎰
          </motion.div>
          <p className="text-gray-600 mt-2 text-sm">Đang tải...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-6">
          <p className="text-red-500 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leaderboard.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">Chưa có ai tham gia! 🎊</p>
        </div>
      )}

      {/* Leaderboard List */}
      {!loading && !error && leaderboard.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.instagram}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border-2 ${getRankStyle(index + 1)} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                {/* Rank & Instagram */}
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold w-8 text-center">
                    {getMedalEmoji(index + 1)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      @{entry.instagram}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.date}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className="font-bold text-sm text-red-600">
                    {formatMoney(entry.amount)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}