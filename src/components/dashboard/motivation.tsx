'use client';

import { useTravelStore } from '@/store/travel-store';
import { INDIA_REGIONS, NORTHEAST_STATES, COASTAL_STATES, MOUNTAIN_STATES, ISLAND_TERRITORIES } from '@/data/india-states';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Mountain, Waves, Flower2, Flag, Heart, Sparkles, Globe, Trophy, MapPin } from 'lucide-react';

interface MotivationMessage {
  icon: React.ElementType;
  message: string;
  color: string;
}

export default function MotivationEngine() {
  const visitedStates = useTravelStore((s) => s.visitedStates);

  const messages = useMemo(() => {
    const visited = visitedStates.size;
    const remaining = 36 - visited;
    const percentage = Math.round((visited / 36) * 100);
    const result: MotivationMessage[] = [];

    if (visited === 0) {
      result.push({
        icon: Globe,
        message: "Start your incredible India journey! Click on a state to mark it as visited.",
        color: 'text-blue-400',
      });
      return result;
    }

    if (visited === 36) {
      result.push({
        icon: Trophy,
        message: "🎉 Incredible! You've explored ALL of India! You are a true Bharat Explorer!",
        color: 'text-yellow-400',
      });
      return result;
    }

    if (remaining <= 3) {
      result.push({
        icon: Flame,
        message: `🔥 Only ${remaining} region${remaining === 1 ? '' : 's'} left! You're SO close to completing India!`,
        color: 'text-orange-400',
      });
    } else if (remaining <= 5) {
      result.push({
        icon: Flame,
        message: `🔥 Only ${remaining} regions left! The finish line is in sight!`,
        color: 'text-orange-400',
      });
    }

    if (percentage >= 50 && percentage < 75) {
      result.push({
        icon: Sparkles,
        message: `🎉 Amazing! You've covered more than half of India!`,
        color: 'text-purple-400',
      });
    }

    if (percentage >= 75) {
      result.push({
        icon: Flag,
        message: `🇮🇳 You're just ${100 - percentage}% away from completing India!`,
        color: 'text-green-400',
      });
    }

    // Check Northeast coverage
    const neVisited = NORTHEAST_STATES.filter((id) => visitedStates.has(id)).length;
    if (neVisited === 0 && visited > 5) {
      result.push({
        icon: Flower2,
        message: '🌸 Northeast India is full of hidden gems. Seven sisters await your visit!',
        color: 'text-pink-400',
      });
    } else if (neVisited > 0 && neVisited < NORTHEAST_STATES.length) {
      result.push({
        icon: Flower2,
        message: `🌸 ${NORTHEAST_STATES.length - neVisited} more Northeast states to explore! Each one is unique.`,
        color: 'text-pink-400',
      });
    }

    // Check islands
    const islandsVisited = ISLAND_TERRITORIES.filter((id) => visitedStates.has(id)).length;
    if (islandsVisited === 0 && visited > 10) {
      result.push({
        icon: Waves,
        message: '🌊 Time to explore the beautiful islands — Andaman and Lakshadweep await!',
        color: 'text-cyan-400',
      });
    }

    // Mountain states
    const mtVisited = MOUNTAIN_STATES.filter((id) => visitedStates.has(id)).length;
    if (mtVisited === 0 && visited > 5) {
      result.push({
        icon: Mountain,
        message: '🏔 The Himalayas are calling! Visit the mountain states for breathtaking views.',
        color: 'text-indigo-400',
      });
    }

    // Coastal states
    const coastVisited = COASTAL_STATES.filter((id) => visitedStates.has(id)).length;
    if (coastVisited > 0 && coastVisited < 5) {
      result.push({
        icon: Waves,
        message: `🏖 You've touched ${coastVisited} coastal regions. India's 7,500 km coastline has so much more!`,
        color: 'text-teal-400',
      });
    }

    // General encouragements based on count
    if (visited >= 1 && visited <= 3) {
      result.push({
        icon: Heart,
        message: '💙 Every journey tells a story. Keep exploring incredible India!',
        color: 'text-blue-400',
      });
    }

    if (visited >= 5 && visited <= 10) {
      result.push({
        icon: MapPin,
        message: '🌍 Great progress! India has endless experiences waiting for you.',
        color: 'text-emerald-400',
      });
    }

    return result.slice(0, 2); // Show max 2 messages
  }, [visitedStates]);

  if (messages.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.message}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            className="glass rounded-xl p-4 flex items-start gap-3"
          >
            <div className={`mt-0.5 ${msg.color}`}>
              <msg.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
