'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  instagram: string;
  amount: number;
  date: string;
}

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
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
    <div className="mt-8">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && leaderboard.length === 0) {
            fetchLeaderboard();
          }
        }}
        className="w-full py-3 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        🏆 {isOpen ? 'Đóng' : 'Xem'} Bảng Xếp Hạng
      </button>

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  🏆 Top 10 May Mắn Nhất
                </h3>
                <button
                  onClick={fetchLeaderboard}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? '⏳' : '🔄'} Làm mới
                </button>
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block text-4xl"
                  >
                    🎰
                  </motion.div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="text-center py-8">
                  <p className="text-red-500">❌ {error}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && leaderboard.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    Chưa có ai tham gia! 🎊
                  </p>
                </div>
              )}

              {/* Leaderboard List */}
              {!loading && !error && leaderboard.length > 0 && (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.instagram}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${getRankStyle(index + 1)} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Rank & Instagram */}
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold w-10 text-center">
                            {getMedalEmoji(index + 1)}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              @{entry.instagram}
                            </p>
                            <p className="text-xs text-gray-500">
                              {entry.date}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <p className="font-bold text-lg text-red-600">
                            {formatMoney(entry.amount)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}