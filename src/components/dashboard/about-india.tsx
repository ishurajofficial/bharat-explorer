import React from 'react';
import { Map, Users, Mountain, Anchor, Compass, Info } from 'lucide-react';
import { 
  TOTAL_INDIA_AREA, 
  TOTAL_INDIA_POPULATION, 
  COASTAL_STATES, 
  MOUNTAIN_STATES, 
  NORTHEAST_STATES 
} from '@/data/india-states';
import { motion } from 'motion/react';

export default function AboutIndia() {
  const formatPop = (num: number) => {
    return (num / 1000000000).toFixed(2) + ' Billion';
  };

  const formatArea = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num) + ' sq km';
  };

  const cards = [
    {
      title: 'Total Population',
      value: formatPop(TOTAL_INDIA_POPULATION),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Total Area',
      value: formatArea(TOTAL_INDIA_AREA),
      icon: Map,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Coastal States',
      value: COASTAL_STATES.length.toString(),
      icon: Anchor,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    },
    {
      title: 'Mountain Regions',
      value: MOUNTAIN_STATES.length.toString(),
      icon: Mountain,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="w-full h-full p-4 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          className="glass p-8 rounded-2xl border border-border/50 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Compass className="w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[var(--saffron)] via-primary to-[var(--india-green)] bg-clip-text text-transparent mb-4">
              Incredible India
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. It's a land of incredible diversity, vibrant cultures, ancient traditions, and modern marvels.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-xl border border-border/50 flex flex-col items-center text-center group hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className={`p-4 rounded-full ${card.bg} ${card.color} mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{card.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Facts */}
        <motion.div 
          className="glass p-6 lg:p-8 rounded-2xl border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Quick Facts</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>It has 28 states and 8 Union territories.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>The Northeast states, known as the "Seven Sister States" (plus Sikkim), represent {NORTHEAST_STATES.length} distinct cultural landscapes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Home to one of the world's oldest civilizations (Indus Valley Civilization).</span>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>It has the world's second-largest road network and fourth-largest railway network.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>The country features 4 biodiverse hotspots and over 100 national parks.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
