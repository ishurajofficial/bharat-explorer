'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTravelStore } from '@/store/travel-store';
import { INDIA_REGIONS, IndiaRegion } from '@/data/india-states';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Trophy,
  Settings,
  Download,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type SidebarView = 'dashboard' | 'statistics' | 'diary' | 'achievements' | 'ai-guide' | 'settings' | 'downloads' | 'about';

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  className?: string;
}

const navItems: { id: SidebarView; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'diary', label: 'Travel Diary', icon: BookOpen },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'about', label: 'About India', icon: Info },
];

export default function Sidebar({ activeView, onViewChange, collapsed, onCollapse, className }: SidebarProps) {
  const { visitedStates, user, logout } = useTravelStore();
  const visitedCount = visitedStates.size;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 glass border-r border-border/50 sidebar-transition ${className ?? ''}`}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center flex-shrink-0">
            <Map className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-bold whitespace-nowrap bg-gradient-to-r from-[var(--saffron)] to-[var(--india-green)] bg-clip-text text-transparent">
                  Bharat Explorer
                </h1>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">Explore Incredible India</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.id === 'achievements' && !collapsed && visitedCount > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                    {visitedCount}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Progress Mini */}
        <div className="p-4 border-t border-border/30">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span className="font-semibold text-foreground">{visitedCount}/36</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-saffron"
                    initial={{ width: 0 }}
                    animate={{ width: `${(visitedCount / 36) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-border/30">
            <AnimatePresence>
              {!collapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-lg flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">Explorer</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-lg" title={user.name}>
                    {user.avatar}
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 border-t border-border/30 text-center">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-muted-foreground/60 mb-2"
              >
                Developed by Ishu Raj
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => onCollapse(!collapsed)}
            className="w-full py-2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center rounded-lg hover:bg-muted/50"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 px-1 py-1 safe-area-bottom">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeView === item.id;
            let mobileLabel = item.label;
            if (mobileLabel === 'Travel Diary') mobileLabel = 'Diary';
            if (mobileLabel === 'Achievements') mobileLabel = 'Trophies';

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 px-1 py-2 rounded-xl text-[9px] sm:text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{mobileLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
