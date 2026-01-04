'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Leaderboard from './components/Leaderboard';
import WheelSpinner from './components/WheelSpinner';

export default function Home() {
  const [instagram, setInstagram] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [previousAmount, setPreviousAmount] = useState<number | null>(null);

  // ...existing code...
  const handleSpin = async () => {
    if (!instagram.trim()) {
      setError('Vui lòng nhập tên Instagram của bạn!');
      return;
    }

    setError('');
    setIsSpinning(true);
    setShowResult(false);
    setIsDuplicate(false);
    setResult(null); // Reset result trước khi quay

    // Gọi API ngay lập tức (không đợi animation)
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instagram: instagram.trim(),
        }),
      });

      const data = await response.json();

      if (data.isDuplicate) {
        // Instagram đã bốc lì xì rồi
        setIsDuplicate(true);
        setPreviousAmount(data.previousAmount);
        setError(data.message);
        
        // Đợi 1s rồi chuyển màn hình
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSpinning(false);
        setShowResult(true);
      } else if (data.success) {
        // Set result để wheel quay đến đúng vị trí
        setResult(data.amount);
        setIsDuplicate(false);
        
        // Đợi animation wheel hoàn tất (5s animation) + 2s để người dùng thấy rõ kết quả
        await new Promise(resolve => setTimeout(resolve, 7000));
        setIsSpinning(false);
        setShowResult(true);
      } else {
        // Lỗi khác
        setError(data.error || 'Đã có lỗi xảy ra');
        setIsSpinning(false);
        setShowResult(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setIsSpinning(false);
      setError('Không thể kết nối đến server');
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-yellow-300 mb-2 drop-shadow-lg">
            🧧 Lì Xì May Mắn 🧧
          </h1>
          <p className="text-white text-lg">Chúc mừng năm mới 2026! </p>
          <p className="text-white text-sm">By divine.thrft </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {!showResult ? (
            <>
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="instagram" className="block text-gray-700 font-semibold mb-2">
                    Tên Instagram của bạn:
                  </label>
                  <input
                    id="instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => {
                      setInstagram(e.target.value);
                      if (error) setError(''); // Xóa lỗi khi user nhập
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSpinning) {
                        handleSpin();
                      }
                    }}
                    placeholder="Tên instagram của bạn ( Ví dụ: divine.thrft)"
                    disabled={isSpinning}
                    className="text-zinc-950 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 transition-colors disabled:bg-gray-100"
                  />
                </div>

                {error && !showResult && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>

              {/* Spin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xl rounded-xl hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSpinning ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      🎰
                    </motion.div>
                    Đang quay...
                  </span>
                ) : (
                  '🎉 QUAY LÌ XÌ 🎉'
                )}
              </button>

              {/* Wheel Spinner - Luôn hiển thị */}
              <div className="py-6">
                <WheelSpinner result={result} isSpinning={isSpinning} />
              </div>

              {/* Leaderboard - Hiển thị khi không đang quay */}
              {!isSpinning && <Leaderboard />}
            </>
          ) : isDuplicate ? (
            /* Duplicate Instagram - Đã bốc rồi */
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">
                😅
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                @{instagram}
              </h2>
              <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl p-6">
                <p className="text-white text-lg mb-2">Bạn đã bốc lì xì rồi!</p>
                <p className="text-3xl font-bold text-white drop-shadow-lg">
                  {previousAmount && formatMoney(previousAmount)}
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border border-orange-200 rounded-xl p-4"
              >
                <p className="text-orange-700 text-sm">
                   Mỗi người chỉ được quay 1 lần!
                </p>
              </motion.div>

              <button
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                  setInstagram('');
                  setError('');
                  setIsDuplicate(false);
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
            </motion.div>
          ) : (
            /* Success Result Display */
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">
                🎊
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Chúc mừng @{instagram}!
              </h2>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6">
                <p className="text-white text-lg mb-2">Bạn nhận được:</p>
                <p className="text-5xl font-bold text-white drop-shadow-lg">
                  {result && formatMoney(result)}
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-3"
              >
                <p className="text-green-700 text-sm">
                  ✓ Đã lưu kết quả thành công!
                </p>
              </motion.div>

              <button
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                  setInstagram('');
                  setError('');
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white mt-6 text-sm">
          Chúc bạn năm mới vui vẻ, hạnh phúc và nhiều may mắn! 🍀
        </p>
      </div>
    </div>
  );
}
