'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { INDIA_REGIONS, IndiaRegion } from '@/data/india-states';
import { useTravelStore } from '@/store/travel-store';

interface SearchProps {
  onSelect: (stateId: string) => void;
}

export default function SearchComponent({ onSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const visitedStates = useTravelStore(s => s.visitedStates);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = INDIA_REGIONS.filter(region => {
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      region.name.toLowerCase().includes(q) ||
      region.capital.toLowerCase().includes(q) ||
      region.language.toLowerCase().includes(q) ||
      region.abbreviation.toLowerCase().includes(q)
    );
  }).slice(0, 5); // Limit to 5 results

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search states, capitals..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary rounded-full h-10"
        />
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-1 glass rounded-xl shadow-xl z-50 border border-border/50 overflow-hidden"
          >
            {results.length > 0 ? (
              <ul className="flex flex-col">
                {results.map((region) => {
                  const isVisited = visitedStates.has(region.id);
                  return (
                    <li key={region.id}>
                      <button
                        onClick={() => {
                          onSelect(region.id);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isVisited ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground">{region.name}</div>
                            <div className="text-xs text-muted-foreground">{region.capital}</div>
                          </div>
                        </div>
                        {isVisited && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
