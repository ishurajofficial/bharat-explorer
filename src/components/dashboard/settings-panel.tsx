'use client';

import { useTravelStore, MapColors } from '@/store/travel-store';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Palette } from 'lucide-react';

export default function SettingsPanel() {
  const { 
    mapColors, 
    setMapColor, 
    showLabels, 
    setShowLabels, 
    showBorders, 
    setShowBorders,
    animationsEnabled,
    setAnimationsEnabled,
    resetAll
  } = useTravelStore();

  const colorConfig: { key: keyof MapColors; label: string }[] = [
    { key: 'visited', label: 'Visited State Color' },
    { key: 'wishlist', label: 'Wishlist State Color' },
    { key: 'notVisited', label: 'Unvisited State Color' },
    { key: 'hover', label: 'Hover Highlight Color' },
    { key: 'border', label: 'Map Border Color' },
    { key: 'background', label: 'Map Background (Land)' },
    { key: 'ocean', label: 'Ocean/Water Background' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Map Colors */}
        <div className="glass p-6 rounded-2xl border border-border/50 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Map Colors</h3>
          </div>
          
          <div className="space-y-4">
            {colorConfig.map(({ key, label }) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Label className="text-sm font-medium text-foreground">{label}</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-border/50 shadow-sm" 
                    style={{ backgroundColor: mapColors[key] }}
                  />
                  <Input 
                    type="color" 
                    value={mapColors[key]} 
                    onChange={(e) => setMapColor(key, e.target.value)}
                    className="w-24 h-8 p-1 cursor-pointer bg-background"
                  />
                  <Input 
                    type="text" 
                    value={mapColors[key]} 
                    onChange={(e) => setMapColor(key, e.target.value)}
                    className="w-24 h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-8">
          <div className="glass p-6 rounded-2xl border border-border/50 space-y-6">
            <h3 className="font-bold text-lg mb-4">Display Options</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Show State Labels</Label>
                <p className="text-sm text-muted-foreground">Display abbreviations on the map</p>
              </div>
              <Switch checked={showLabels} onCheckedChange={setShowLabels} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Show Borders</Label>
                <p className="text-sm text-muted-foreground">Display borders between states</p>
              </div>
              <Switch checked={showBorders} onCheckedChange={setShowBorders} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Enable Animations</Label>
                <p className="text-sm text-muted-foreground">Smooth transitions when rendering</p>
              </div>
              <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-4">
            <h3 className="font-bold text-lg text-red-500">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">This will permanently delete all your visited states, wishlists, and travel diaries.</p>
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={() => {
                if(window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                  resetAll();
                }
              }}
            >
              <RefreshCcw className="w-4 h-4" />
              Reset All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
