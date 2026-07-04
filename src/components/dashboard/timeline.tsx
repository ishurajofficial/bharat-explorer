'use client';

import { useMemo } from 'react';
import { useTravelStore } from '@/store/travel-store';
import { INDIA_REGIONS } from '@/data/india-states';
import { MapPin, Calendar, Star, Navigation, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Timeline() {
  const { visitedStates, travelNotes } = useTravelStore();

  const timelineEvents = useMemo(() => {
    // Collect all visited states, enrich with notes if any
    const events = Array.from(visitedStates).map(id => {
      const region = INDIA_REGIONS.find(r => r.id === id);
      const note = travelNotes[id] || {};
      
      return {
        id,
        name: region?.name || id,
        year: note.yearVisited || 0, // 0 if not set, will sort to bottom
        month: note.monthVisited,
        notes: note.notes,
        rating: note.rating,
        companion: note.companion,
        transport: note.transport,
      };
    });

    // Sort descending by year, then by month
    return events.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return (b.month || 0) - (a.month || 0);
    });
  }, [visitedStates, travelNotes]);

  if (visitedStates.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl border border-border/50 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold mb-2">Your Diary is Empty</h3>
        <p className="text-muted-foreground">
          Mark states as visited and add notes to build your travel timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="relative wrap overflow-hidden p-4 md:p-8">
      {/* Vertical line */}
      <div className="absolute border-opacity-20 border-border h-full border-l-2 left-8 md:left-1/2 transform md:-translate-x-1/2"></div>
      
      <div className="space-y-8">
        {timelineEvents.map((event, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-start ${isLeft ? 'md:flex-row-reverse' : ''} w-full`}
            >
              {/* Spacer for alternating layout on desktop */}
              <div className="hidden md:block w-5/12"></div>
              
              {/* Icon Marker */}
              <div className="z-10 flex items-center justify-center bg-background border-4 border-border w-8 h-8 rounded-full shadow-xl ml-4 md:ml-0 md:mx-auto">
                <div className="w-2 h-2 rounded-full bg-saffron" />
              </div>
              
              {/* Content Card */}
              <div className="w-full md:w-5/12 pl-12 md:pl-0 pt-2 md:pt-0">
                <div className={`glass p-6 rounded-2xl border border-border/50 shadow-lg ${isLeft ? 'md:mr-8 md:text-right' : 'md:ml-8 text-left'}`}>
                  <div className={`flex flex-wrap items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                    <h3 className="font-bold text-xl text-foreground">{event.name}</h3>
                    {event.year > 0 && (
                      <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.month ? `${new Date(2000, event.month - 1).toLocaleString('default', { month: 'short' })} ` : ''}{event.year}
                      </span>
                    )}
                  </div>
                  
                  {event.rating && (
                    <div className={`flex items-center gap-1 mb-3 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (event.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  )}

                  {event.notes ? (
                    <p className="text-muted-foreground text-sm italic border-l-2 border-primary/30 pl-3 py-1 my-3 bg-primary/5 rounded-r">
                      "{event.notes}"
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Visited! Click on this state on the map to add notes and dates to your diary.
                    </p>
                  )}

                  {(event.companion || event.transport) && (
                    <div className={`flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                      {event.companion && (
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> With {event.companion}</span>
                      )}
                      {event.transport && (
                        <span className="flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5" /> By {event.transport}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
