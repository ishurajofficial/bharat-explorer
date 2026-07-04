'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTravelStore } from '@/store/travel-store';
import { Card, CardContent } from '@/components/ui/card';

export default function ProgressRing() {
  const visitedStates = useTravelStore((s) => s.visitedStates);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const totalRegions = 36;
  const visitedCount = visitedStates.size;
  const percentage = Math.round((visitedCount / totalRegions) * 100);

  useEffect(() => {
    // Animate the percentage number
    let startTimestamp: number;
    const duration = 1500;
    const startValue = animatedPercent;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedPercent(Math.floor(easeProgress * (percentage - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setAnimatedPercent(percentage);
      }
    };

    requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  const size = 240;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="glass overflow-hidden border-border/50 relative">
      <CardContent className="p-8 flex flex-col items-center justify-center relative">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Subtle glow behind the ring */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-gradient-to-tr from-[var(--saffron)] to-[var(--india-green)]" />
          
          <svg
            className="transform -rotate-90 relative z-10"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background Ring */}
            <circle
              className="text-muted/50 stroke-current"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx={center}
              cy={center}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--saffron)" />
                <stop offset="50%" stopColor="var(--saffron)" />
                <stop offset="100%" stopColor="var(--india-green)" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Foreground Ring */}
            <motion.circle
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx={center}
              cy={center}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
              filter="url(#glow)"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Explored
            </span>
            <div className="flex items-baseline">
              <span className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-[var(--saffron)] to-[var(--india-green)] bg-clip-text text-transparent">
                {animatedPercent}
              </span>
              <span className="text-2xl font-bold text-foreground ml-1">%</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground mt-1">
              of India
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
