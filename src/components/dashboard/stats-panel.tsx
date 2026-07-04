'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useTravelStore } from '@/store/travel-store';
import { INDIA_REGIONS, TOTAL_INDIA_AREA, TOTAL_INDIA_POPULATION } from '@/data/india-states';
import { MapPin, Mountain, Palmtree, Users, Ruler, Globe, TrendingUp, Award, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Animated Counter component
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 1000;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (value - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  const formatted = new Intl.NumberFormat('en-IN').format(count);
  return <span>{prefix}{formatted}{suffix}</span>;
}

export default function StatsPanel() {
  const { visitedStates, wishlistStates } = useTravelStore();
  
  const stats = useMemo(() => {
    let statesCount = 0;
    let utsCount = 0;
    let coveredArea = 0;
    let coveredPop = 0;

    visitedStates.forEach((id) => {
      const region = INDIA_REGIONS.find((r) => r.id === id);
      if (region) {
        if (region.type === 'state') statesCount++;
        if (region.type === 'ut') utsCount++;
        coveredArea += region.area;
        coveredPop += region.population;
      }
    });

    const totalCount = statesCount + utsCount;
    const remainingCount = 36 - totalCount;
    
    // Exact percentage calculations
    const areaPercent = (coveredArea / TOTAL_INDIA_AREA) * 100;
    const popPercent = (coveredPop / TOTAL_INDIA_POPULATION) * 100;

    return [
      {
        id: 'states',
        label: 'States Visited',
        value: statesCount,
        total: 28,
        icon: MapPin,
        color: 'bg-orange-500',
        textColor: 'text-orange-500',
      },
      {
        id: 'uts',
        label: 'UTs Visited',
        value: utsCount,
        total: 8,
        icon: Globe,
        color: 'bg-green-500',
        textColor: 'text-green-500',
      },
      {
        id: 'total',
        label: 'Total Regions',
        value: totalCount,
        total: 36,
        icon: TrendingUp,
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
      },
      {
        id: 'area',
        label: 'Area Covered (km²)',
        value: coveredArea,
        percent: areaPercent,
        icon: Ruler,
        color: 'bg-purple-500',
        textColor: 'text-purple-500',
      },
      {
        id: 'pop',
        label: 'Population Covered',
        value: coveredPop,
        percent: popPercent,
        icon: Users,
        color: 'bg-pink-500',
        textColor: 'text-pink-500',
      },
      {
        id: 'wishlist',
        label: 'Wishlisted',
        value: wishlistStates.size,
        total: 36,
        icon: Star,
        color: 'bg-purple-500',
        textColor: 'text-purple-500',
      },
      {
        id: 'remaining',
        label: 'Remaining',
        value: remainingCount,
        total: 36,
        icon: Award,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-500',
      },
    ];
  }, [visitedStates, wishlistStates]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass overflow-hidden border-border/50 relative group h-full">
            <div className={`absolute top-0 left-0 w-full h-1 ${stat.color}`} />
            
            <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-background/50 ${stat.textColor}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.percent !== undefined && (
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-background/50">
                    {stat.percent.toFixed(1)}%
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  {stat.total && (
                    <span className="text-sm text-muted-foreground font-medium">
                      / {stat.total}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Decorative background glow */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${stat.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
