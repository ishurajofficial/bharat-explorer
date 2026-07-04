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
    <header className="sticky top-0 z-30 w-full glass border-b border-border/50 px-4 py-3 flex items-center justify-between gap-4">
      {/* Search Bar - hidden on very small screens, visible on md+ */}
      <div className="flex-1 max-w-md hidden md:block">
        <SearchComponent onSelect={onSearchSelect} />
      </div>

      {/* spacer for mobile */}
      <div className="flex-1 md:hidden"></div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="glass border-border/50 hidden md:flex"
          onClick={onDownloadClick}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Map
        </Button>

        {/* Theme Toggle Button - Simple fallback since we don't have dropdown yet */}
        <Button
          variant="outline"
          size="icon"
          className="glass border-border/50 rounded-full"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
