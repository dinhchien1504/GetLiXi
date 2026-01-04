'use client';

import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface WheelSpinnerProps {
  result: number | null;
  isSpinning: boolean;
}

// Các giá trị tiền có thể có - 11 giá trị giống backend
const MONEY_VALUES = [
  20000, 40000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000, 400000, 500000
];

export default function WheelSpinner({ result, isSpinning }: WheelSpinnerProps) {
  const rotation = useMotionValue(0);
  const [isResultReady, setIsResultReady] = useState(false);
  const animationRef = useRef<any>(null);

  const segmentAngle = 360 / MONEY_VALUES.length;
  const radius = 150; // Bán kính vòng tròn
  const centerX = 160;
  const centerY = 160;

  useEffect(() => {
    // Stop animation khi component unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  // ...existing code...
  // ...existing code...
  useEffect(() => {
    if (isSpinning && !result) {
      // Bắt đầu quay liên tục
      setIsResultReady(false);
      
      // Dừng animation cũ nếu có
      if (animationRef.current) {
        animationRef.current.stop();
      }

      // Quay liên tục với tốc độ ổn định (1 vòng/giây)
      animationRef.current = animate(rotation, rotation.get() + 360 * 100, {
        duration: 100,
        ease: "linear",
        repeat: Infinity,
      });
      
    } else if (result !== null && isSpinning) {
      // Server trả về kết quả
      setIsResultReady(true);
      
      const resultIndex = MONEY_VALUES.indexOf(result);
      
      if (resultIndex !== -1) {
        // Dừng animation liên tục
        if (animationRef.current) {
          animationRef.current.stop();
        }

        // Lấy vị trí hiện tại
        const currentRotation = rotation.get() % 360;
        
        // Tính góc của segment kết quả (mỗi segment bắt đầu từ index * segmentAngle)
        // Mũi tên ở trên cùng (góc 0), nên cần quay ngược lại
        const targetAngle = resultIndex * segmentAngle + segmentAngle / 2;
        
        // Tính góc cần quay để mũi tên trỏ vào giữa segment kết quả
        // Vì vòng quay theo chiều kim đồng hồ, cần tính: 360 - targetAngle
        const finalAngle = (360 - targetAngle) % 360;
        
        // Tính số độ cần quay từ vị trí hiện tại
        let rotationNeeded = finalAngle - currentRotation;
        if (rotationNeeded < 0) {
          rotationNeeded += 360;
        }
        
        // Quay thêm 5 vòng
        const extraSpins = 5;
        const totalRotation = (360 * extraSpins) + rotationNeeded;
        
        // Quay với tốc độ đều
        const duration = totalRotation / 360;
        
        animationRef.current = animate(rotation, rotation.get() + totalRotation, {
          duration: duration,
          ease: [0, 0, 0.68, 1],
        });
      }
    } else if (!isSpinning) {
      // Dừng hẳn khi không quay
      if (animationRef.current) {
        animationRef.current.stop();
      }
    }
  }, [result, isSpinning, rotation, segmentAngle]);



  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `${amount / 1000000}TR`;
    }
    return `${amount / 1000}K`;
  };

  const getColor = (index: number) => {
    const colors = [
      '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7',
      '#ec4899', '#f97316', '#06b6d4', '#6366f1', '#14b8a6', '#f43f5e'
    ];
    return colors[index % colors.length];
  };

  // Tạo path SVG cho mỗi segment
  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // Tính vị trí text ở giữa mỗi segment
  const getTextPosition = (index: number) => {
    const angle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
    const textRadius = radius * 0.7; // Đặt text ở 70% bán kính
    
    return {
      x: centerX + textRadius * Math.cos(angle),
      y: centerY + textRadius * Math.sin(angle),
      rotation: (index + 0.5) * segmentAngle
    };
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Mũi tên chỉ vị trí */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
      </div>

      {/* Vòng quay SVG */}
      <motion.div
        className="relative w-full h-full"
        style={{ 
          transformOrigin: 'center center',
          rotate: rotation
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="drop-shadow-2xl"
        >
          {/* Vẽ các segments */}
          {MONEY_VALUES.map((value, index) => (
            <g key={value}>
              {/* Segment path */}
              <path
                d={createSegmentPath(index)}
                fill={getColor(index)}
                stroke="white"
                strokeWidth="2"
              />
              
              {/* Text */}
              <text
                x={getTextPosition(index).x}
                y={getTextPosition(index).y}
                fill="white"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${getTextPosition(index).rotation}, ${getTextPosition(index).x}, ${getTextPosition(index).y})`}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              >
                {formatMoney(value)}
              </text>
            </g>
          ))}
          
          {/* Trung tâm vòng quay */}
          <circle
            cx={centerX}
            cy={centerY}
            r="30"
            fill="white"
            stroke="#facc15"
            strokeWidth="4"
          />
        </svg>

        {/* Icon trung tâm */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl pointer-events-none">
          🧧
        </div>
      </motion.div>

      {/* Viền ngoài */}
      <div className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-2xl pointer-events-none"></div>
    </div>
  );
}
