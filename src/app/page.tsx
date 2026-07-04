'use client';

import { useState, useEffect } from 'react';
import { useTravelStore } from '@/store/travel-store';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarView } from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import IndiaMap from '@/components/map/india-map';
import StatsPanel from '@/components/dashboard/stats-panel';
import AnalyticsCharts from '@/components/dashboard/analytics-charts';
import ProgressRing from '@/components/dashboard/progress-ring';
import Achievements from '@/components/dashboard/achievements';
import MotivationEngine from '@/components/dashboard/motivation';
import Timeline from '@/components/dashboard/timeline';
import StateDetailDrawer from '@/components/map/state-detail-drawer';
import DownloadModal from '@/components/export/download-modal';
import SettingsPanel from '@/components/dashboard/settings-panel';
import AIChatbot from '@/components/dashboard/ai-chat';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState<SidebarView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const { theme, resetAll, mapMode, mapFilter, user } = useTravelStore();

  useEffect(() => {
    setIsMounted(true);
    if (!useTravelStore.getState().user) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  if (!isMounted || !user) return null; // Avoid hydration mismatch and flash of content

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="gradient-blob bg-saffron w-[500px] h-[500px] -top-[250px] -left-[100px]" style={{ animationDelay: '0s' }} />
        <div className="gradient-blob bg-india-green w-[600px] h-[600px] -bottom-[300px] -right-[100px]" style={{ animationDelay: '-4s' }} />
        <div className="gradient-blob bg-navy w-[400px] h-[400px] top-[40%] left-[20%]" style={{ animationDelay: '-2s' }} />
      </div>

      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        } pb-20 md:pb-0 min-h-screen flex flex-col`}
      >
        <Header 
          onSearchSelect={(id) => setSelectedStateId(id)}
          onDownloadClick={() => setIsDownloadModalOpen(true)}
        />

        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Top section: Map + Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Map Area */}
                  <div className="lg:col-span-2 glass rounded-2xl border border-border/50 p-2 flex flex-col relative min-h-[500px]" id="india-map-capture">
                    <div className="relative z-10 glass px-4 py-4 mx-4 mt-4 mb-2 rounded-xl border border-border/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <h2 className="font-bold text-lg text-foreground">Interactive Map</h2>
                        <p className="text-xs text-muted-foreground">Click on regions to mark them</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Map Mode Toggle */}
                        <div className="flex bg-background/50 p-1 rounded-lg border border-border/50">
                          <button
                            onClick={() => useTravelStore.getState().setMapMode('visited')}
                            className={`flex-1 text-xs font-medium px-4 py-1.5 rounded-md transition-colors ${mapMode === 'visited' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                          >
                            Visited
                          </button>
                          <button
                            onClick={() => useTravelStore.getState().setMapMode('wishlist')}
                            className={`flex-1 text-xs font-medium px-4 py-1.5 rounded-md transition-colors ${mapMode === 'wishlist' ? 'bg-background shadow text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                          >
                            Wishlist
                          </button>
                        </div>

                        {/* Map Filter */}
                        <div className="flex bg-background/50 p-1 rounded-lg border border-border/50 flex-wrap gap-1">
                          {(['all', 'coastal', 'mountain', 'northeast'] as const).map(filter => (
                            <button
                              key={filter}
                              onClick={() => useTravelStore.getState().setMapFilter(filter)}
                              className={`flex-1 text-[10px] font-medium px-3 py-1.5 rounded-md transition-colors capitalize ${mapFilter === filter ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <IndiaMap 
                      className="flex-1 min-h-[500px]" 
                      onStateClick={setSelectedStateId}
                    />
                  </div>

                  {/* Right Column: Progress & Motivation */}
                  <div className="space-y-6 flex flex-col">
                    <ProgressRing />
                    <div className="flex-1">
                      <MotivationEngine />
                    </div>
                  </div>
                </div>

                {/* Stats Panel underneath */}
                <StatsPanel />
                
                {/* Achievements Panel */}
                <Achievements />
              </motion.div>
            )}

            {activeView === 'statistics' && (
              <motion.div 
                key="statistics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-6">Detailed Statistics</h2>
                <StatsPanel />
                <AnalyticsCharts />
              </motion.div>
            )}

            {activeView === 'diary' && (
              <motion.div 
                key="diary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Travel Diary</h2>
                  <p className="text-muted-foreground">Your chronological journey across India.</p>
                </div>
                <Timeline />
              </motion.div>
            )}

            {activeView === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Settings & Customization</h2>
                  <p className="text-muted-foreground">Personalize your Bharat Explorer experience.</p>
                </div>
                <SettingsPanel />
              </motion.div>
            )}

            {activeView === 'achievements' && (
              <motion.div 
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Travel Achievements</h2>
                  <p className="text-muted-foreground">Unlock badges by exploring different parts of India.</p>
                </div>
                <Achievements />
              </motion.div>
            )}



            {activeView === 'downloads' && (
              <motion.div 
                key="downloads"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-3xl font-bold mb-6">Downloads & Export</h2>
                <div className="max-w-2xl">
                  <p className="text-muted-foreground mb-6">
                    Click the export button below to download your map as an image, PDF, or backup your JSON data.
                  </p>
                  <Button onClick={() => setIsDownloadModalOpen(true)} className="gradient-saffron text-white border-0">
                    Open Export Menu
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals & Drawers */}
      <StateDetailDrawer 
        stateId={selectedStateId} 
        onClose={() => setSelectedStateId(null)} 
      />
      
      <DownloadModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
