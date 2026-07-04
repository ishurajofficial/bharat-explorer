'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTravelStore } from '@/store/travel-store';
import { NORTHEAST_STATES, ISLAND_TERRITORIES, MOUNTAIN_STATES, COASTAL_STATES } from '@/data/india-states';
import { Trophy, Star, Mountain, Compass, Anchor, TreePine, Flag, Sparkles, Crown, Map as MapIcon, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requirement: (visited: Set<string>) => boolean;
  progressText: (visited: Set<string>) => string;
  gradient: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Visited your first region',
    icon: Flag,
    requirement: (v) => v.size >= 1,
    progressText: (v) => `${Math.min(v.size, 1)}/1 Region`,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visited 10 regions',
    icon: Compass,
    requirement: (v) => v.size >= 10,
    progressText: (v) => `${Math.min(v.size, 10)}/10 Regions`,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'half-india',
    title: 'Half India',
    description: 'Visited 18 regions',
    icon: MapIcon,
    requirement: (v) => v.size >= 18,
    progressText: (v) => `${Math.min(v.size, 18)}/18 Regions`,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'almost-there',
    title: 'Almost There',
    description: 'Visited 30 regions',
    icon: Star,
    requirement: (v) => v.size >= 30,
    progressText: (v) => `${Math.min(v.size, 30)}/30 Regions`,
    gradient: 'from-purple-500 to-fuchsia-500',
  },
  {
    id: 'india-master',
    title: 'India Master',
    description: 'Visited all 36 regions',
    icon: Crown,
    requirement: (v) => v.size >= 36,
    progressText: (v) => `${Math.min(v.size, 36)}/36 Regions`,
    gradient: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'northeast',
    title: 'Northeast Explorer',
    description: 'Visited all 8 Northeast states',
    icon: TreePine,
    requirement: (v) => NORTHEAST_STATES.every((id) => v.has(id)),
    progressText: (v) => `${NORTHEAST_STATES.filter((id) => v.has(id)).length}/8 NE States`,
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'island-hopper',
    title: 'Island Hopper',
    description: 'Visited both island territories',
    icon: Anchor,
    requirement: (v) => ISLAND_TERRITORIES.every((id) => v.has(id)),
    progressText: (v) => `${ISLAND_TERRITORIES.filter((id) => v.has(id)).length}/2 Islands`,
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'mountain-climber',
    title: 'Mountain Climber',
    description: 'Visited all Himalayan states',
    icon: Mountain,
    requirement: (v) => MOUNTAIN_STATES.every((id) => v.has(id)),
    progressText: (v) => `${MOUNTAIN_STATES.filter((id) => v.has(id)).length}/5 Mountain States`,
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    id: 'coastal-king',
    title: 'Coastal King',
    description: 'Visited all coastal states',
    icon: Sparkles,
    requirement: (v) => COASTAL_STATES.every((id) => v.has(id)),
    progressText: (v) => `${COASTAL_STATES.filter((id) => v.has(id)).length}/13 Coastal Regions`,
    gradient: 'from-teal-400 to-cyan-500',
  },
];

export default function Achievements() {
  const visitedStates = useTravelStore((s) => s.visitedStates);
  const animationsEnabled = useTravelStore((s) => s.animationsEnabled);
  
  // Track previously unlocked to trigger confetti on new unlocks
  const prevUnlockedRef = useRef<Set<string>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  useEffect(() => {
    const currentUnlocked = new Set(
      ACHIEVEMENTS.filter((a) => a.requirement(visitedStates)).map((a) => a.id)
    );

    if (animationsEnabled && prevUnlockedRef.current.size > 0) {
      const newlyAdded = Array.from(currentUnlocked).find(
        (id) => !prevUnlockedRef.current.has(id)
      );

      if (newlyAdded) {
        setNewlyUnlocked(newlyAdded);
        
        // Trigger confetti
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF9933', '#FFFFFF', '#138808', '#000080'],
            zIndex: 100,
          });
        });

        // Clear newly unlocked state after animation
        setTimeout(() => setNewlyUnlocked(null), 3000);
      }
    }

    prevUnlockedRef.current = currentUnlocked;
  }, [visitedStates, animationsEnabled]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ACHIEVEMENTS.map((achievement, i) => {
        const isUnlocked = achievement.requirement(visitedStates);
        const isNewlyUnlocked = newlyUnlocked === achievement.id;

        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={isNewlyUnlocked ? 'badge-unlock z-10' : ''}
          >
            <Card 
              className={`glass overflow-hidden h-full transition-all duration-500 ${
                isUnlocked 
                  ? 'border-primary/30 shadow-[0_0_15px_rgba(255,153,51,0.1)]' 
                  : 'border-border/40 opacity-70 grayscale-[0.8]'
              }`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div 
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden ${
                    isUnlocked ? `bg-gradient-to-br ${achievement.gradient}` : 'bg-muted'
                  }`}
                >
                  <achievement.icon className={`w-7 h-7 ${isUnlocked ? 'text-white drop-shadow-md' : 'text-muted-foreground'}`} />
                  
                  {isUnlocked && (
                    <motion.div 
                      className="absolute inset-0 bg-white opacity-0"
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`font-bold truncate ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {achievement.description}
                  </p>
                  
                  <Badge variant={isUnlocked ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                    {achievement.progressText(visitedStates)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
