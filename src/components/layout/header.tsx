'use client';

import { Moon, Sun, Monitor, Download } from 'lucide-react';
import { useTravelStore } from '@/store/travel-store';
import SearchComponent from '@/components/dashboard/search';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSearchSelect: (stateId: string) => void;
  onDownloadClick: () => void;
}

export default function Header({ onSearchSelect, onDownloadClick }: HeaderProps) {
  const { theme, setTheme } = useTravelStore();

  return (
    <header className="sticky top-0 z-30 w-full glass border-b border-border/50 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Mobile Top Row: Logo & Theme */}
      <div className="flex items-center justify-between w-full md:w-auto md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center flex-shrink-0">
            <Map className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold bg-gradient-to-r from-[var(--saffron)] to-[var(--india-green)] bg-clip-text text-transparent">
            Bharat
          </h1>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="glass border-border/50 rounded-full w-8 h-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Search Bar - Full width on mobile, max-w on desktop */}
      <div className="w-full md:flex-1 md:max-w-md">
        <SearchComponent onSelect={onSearchSelect} />
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="glass border-border/50"
          onClick={onDownloadClick}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Map
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="glass border-border/50 rounded-full"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
