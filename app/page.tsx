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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Topographic background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)'
        }}></div>
      </div>
      
      {/* Ambient glow elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-md w-full relative z-10">
        {/* Header - Supply Station */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <div className="inline-block px-4 py-1 bg-slate-900 bg-opacity-60 backdrop-blur-md border border-green-800 border-opacity-40 rounded-full mb-2">
              <span className="text-green-500 text-xs font-bold tracking-widest uppercase">GET LIXI </span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-black text-white mb-3 tracking-tight uppercase" 
            style={{
              textShadow: '0 0 30px rgba(34, 197, 94, 0.3), 0 2px 10px rgba(0, 0, 0, 0.8)',
              letterSpacing: '0.05em'
            }}
          >
            divine.thrft
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center justify-center gap-3 text-slate-400 text-sm font-medium tracking-wide"
          >
            <span className="w-8 h-px bg-green-700"></span>
            <span className="uppercase text-xs">Reward Discount</span>
            <span className="w-8 h-px bg-green-700"></span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-3"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600 bg-opacity-20 border border-orange-600 border-opacity-30 rounded text-orange-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
              LiXi 
            </span>
          </motion.div>
        </div>
        
        {/* Main Card - Gear Crate HUD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-slate-900 bg-opacity-40 backdrop-blur-xl rounded-lg p-6 space-y-5 border border-slate-700 border-opacity-50 relative overflow-hidden" 
          style={{
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(34, 197, 94, 0.1)',
          }}
        >
          {/* Corner accents - tactical UI */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-700 opacity-30"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-700 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-700 opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-700 opacity-30"></div>
          
          {/* HUD Status bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4">
            {/* <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SYSTEM ACTIVE
            </span>
            <span className="opacity-50">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span> */}
          </div>
          {!showResult ? (
            <>
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="instagram" className="block text-green-500 font-bold mb-2 tracking-wider text-xs uppercase">
                    ▸ Username Ig
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
                    placeholder="@username"
                    disabled={isSpinning}
                    className="text-white w-full px-4 py-3 bg-black bg-opacity-50 backdrop-blur-sm rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-green-600 transition-all disabled:opacity-50 placeholder:text-slate-600 border border-slate-700"
                    style={{
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(34, 197, 94, 0.1)',
                    }}
                  />
                </div>

                {error && !showResult && (
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>

              {/* Deploy Button - Gear inspired */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-4 bg-gradient-to-r from-green-800 to-green-700 text-white font-black text-sm rounded border border-green-600 border-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden uppercase tracking-widest"
                style={{
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 0 rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isSpinning) {
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(34, 197, 94, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSpinning) {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 0 rgba(0, 0, 0, 0.3)';
                  }
                }}
              >
                {/* Safety stripe accent */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
                {isSpinning ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      ⚙
                    </motion.div>
                    Applying...
                  </span>
                ) : (
                  'Get LiXi'
                )}
              </motion.button>

              {/* Reward Wheel - Equipment Style */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="py-6 relative" 
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-3 py-1 bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-green-700 border-opacity-30 rounded-full">
                    <span className="text-green-500 text-xs font-bold tracking-wider uppercase"></span>
                  </div>
                </div>
                <WheelSpinner result={result} isSpinning={isSpinning} />
              </motion.div>

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
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                @{instagram}
              </h2>
              <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded border border-slate-700 border-opacity-50 p-6" style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}>
                <p className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-wider">Crate Already Claimed</p>
                <p className="text-3xl font-black text-white">
                  {previousAmount && formatMoney(previousAmount)}
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-900 bg-opacity-20 backdrop-blur-sm rounded border border-orange-600 border-opacity-30 p-3"
                style={{
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(249, 115, 22, 0.2)',
                }}
              >
                <p className="text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>⚠</span> One Drop Per Operator
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                  setInstagram('');
                  setError('');
                  setIsDuplicate(false);
                }}
                className="w-full py-3 bg-slate-800 bg-opacity-70 backdrop-blur-md text-purple-200 font-semibold rounded-xl transition-all border border-purple-500 border-opacity-30"
                style={{
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                Go Back
              </motion.button>
            </motion.div>
          ) : (
            /* Success Result Display */
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                Mission Complete: @{instagram}
              </h2>
              <div className="bg-gradient-to-br from-green-900 to-green-800 bg-opacity-40 backdrop-blur-xl rounded border-2 border-green-600 border-opacity-50 p-6 relative overflow-hidden" style={{
                boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.1)',
              }}>
                {/* Safety stripe accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"></div>
                
                <p className="text-green-400 text-sm mb-2 font-black uppercase tracking-widest">Reward LiXi</p>
                <p className="text-5xl font-black text-white" style={{
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)'
                }}>
                  {result && formatMoney(result)}
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 bg-opacity-60 backdrop-blur-md rounded border border-slate-700 border-opacity-50 p-3"
                style={{
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(34, 197, 94, 0.2)',
                }}
              >
                <p className="text-green-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  <span>✓</span> LiXi
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                  setInstagram('');
                  setError('');
                }}
                className="w-full py-3 bg-slate-800 bg-opacity-70 backdrop-blur-md text-slate-300 font-bold rounded border border-slate-700 transition-all uppercase tracking-wider text-sm"
                style={{
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                ◀ Return to Base
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Footer - Expedition Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">
            Expedition Active • Limited Supply
          </p>
        </motion.div>
      </div>
    </div>
  );
}
