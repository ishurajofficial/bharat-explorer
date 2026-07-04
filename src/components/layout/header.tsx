'use client';

import { Moon, Sun, Download, Map, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { useTravelStore } from '@/store/travel-store';
import SearchComponent from '@/components/dashboard/search';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HeaderProps {
  onSearchSelect: (stateId: string) => void;
  onDownloadClick: () => void;
}

export default function Header({ onSearchSelect, onDownloadClick }: HeaderProps) {
  const { theme, setTheme, logout, user } = useTravelStore();

  const UserProfileMenu = () => {
    if (!user) return null;
    
    // Generate a dummy email based on name if not provided
    const email = `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@example.com`;
    
    return (
      <Popover>
        <PopoverTrigger className="flex items-center gap-1.5 md:gap-2 hover:bg-muted/50 p-1 pr-2 md:pr-3 rounded-full transition-colors border border-border/50 bg-background/50 h-8 md:h-10 ml-1 outline-hidden">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-xs md:text-sm flex-shrink-0">
            {user.avatar}
          </div>
          <span className="text-[10px] md:text-sm font-semibold max-w-[60px] md:max-w-[120px] truncate">{user.name}</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-2">
          <div className="flex flex-col gap-1 p-2 border-b border-border/50 mb-2">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          
          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2">
              <UserIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 mt-1" 
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full glass border-b border-border/50 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Mobile Top Row: Logo & Theme/Profile */}
      <div className="flex items-center justify-between w-full md:w-auto md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center flex-shrink-0">
            <Map className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold bg-gradient-to-r from-[var(--saffron)] to-[var(--india-green)] bg-clip-text text-transparent">
            Bharat Explorer
          </h1>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="glass border-border/50 rounded-full w-8 h-8 flex-shrink-0"
            onClick={onDownloadClick}
          >
            <Download className="w-4 h-4" />
            <span className="sr-only">Export Map</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="glass border-border/50 rounded-full w-8 h-8 flex-shrink-0"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <UserProfileMenu />
        </div>
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
          className="glass border-border/50 rounded-full w-10 h-10"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <UserProfileMenu />
      </div>
    </header>
  );
}
