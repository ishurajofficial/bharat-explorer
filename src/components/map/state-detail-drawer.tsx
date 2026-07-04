'use client';

import { INDIA_REGIONS } from '@/data/india-states';
import { useTravelStore } from '@/store/travel-store';
import { MapPin, Users, Ruler, Languages, Building2, Calendar, Map, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import DiaryForm from '@/components/dashboard/diary-form';

interface StateDetailDrawerProps {
  stateId: string | null;
  onClose: () => void;
}

export default function StateDetailDrawer({ stateId, onClose }: StateDetailDrawerProps) {
  const { visitedStates, toggleVisited } = useTravelStore();
  
  if (!stateId) return null;
  
  const region = INDIA_REGIONS.find((r) => r.id === stateId);
  if (!region) return null;
  
  const isVisited = visitedStates.has(stateId);
  const numberFormatter = new Intl.NumberFormat('en-IN');

  return (
    <Drawer open={!!stateId} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh] glass bg-background/95 backdrop-blur-xl border-border/50">
        <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <DrawerHeader className="relative text-left pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DrawerTitle className="text-2xl font-bold flex items-center gap-2">
                  {region.name}
                  {isVisited && (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white border-0 flex gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Visited
                    </Badge>
                  )}
                </DrawerTitle>
                <DrawerDescription className="mt-1.5 flex items-center gap-2 text-base">
                  <Badge variant="outline" className="text-xs uppercase tracking-wider bg-background/50">
                    {region.type === 'state' ? 'State' : 'Union Territory'}
                  </Badge>
                  <span className="text-muted-foreground">{region.region.charAt(0).toUpperCase() + region.region.slice(1)} India</span>
                </DrawerDescription>
              </div>
              
              <Button 
                onClick={() => toggleVisited(stateId)}
                variant={isVisited ? "outline" : "default"}
                className={isVisited ? "border-green-500/50 text-green-500 hover:bg-green-500/10" : "gradient-saffron text-white border-0 hover:opacity-90"}
              >
                {isVisited ? 'Mark as Unvisited' : 'Mark as Visited'}
              </Button>
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[50vh] md:h-[60vh] px-4 py-2 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-3 rounded-xl border border-border/50 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium">Capital</span>
                </div>
                <span className="font-semibold">{region.capital}</span>
              </div>
              
              <div className="glass p-3 rounded-xl border border-border/50 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Ruler className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium">Area</span>
                </div>
                <span className="font-semibold">{numberFormatter.format(region.area)} <span className="text-xs font-normal text-muted-foreground">km²</span></span>
              </div>
              
              <div className="glass p-3 rounded-xl border border-border/50 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-medium">Population</span>
                </div>
                <span className="font-semibold">{numberFormatter.format(region.population)}</span>
              </div>
              
              <div className="glass p-3 rounded-xl border border-border/50 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Languages className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-medium">Language</span>
                </div>
                <span className="font-semibold truncate" title={region.language}>{region.language}</span>
              </div>
            </div>

            {visitedStates.has(region.id) && (
              <>
                <Separator className="bg-border/50 my-6" />
                <DiaryForm stateId={region.id} />
              </>
            )}

            <Separator className="bg-border/50 my-6" />

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-[var(--saffron)]" />
                    Top Destinations
                  </h4>
                  <ul className="space-y-2">
                    {region.tourism.map((place, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{place}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-base mb-2 text-muted-foreground">Famous Cuisine</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.cuisine.map((dish, i) => (
                        <Badge key={i} variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-0">{dish}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-base mb-2 text-muted-foreground">Major Festivals</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.festivals.map((fest, i) => (
                        <Badge key={i} variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-0">{fest}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-4 rounded-xl border border-border/50 bg-primary/5">
                <h4 className="font-semibold text-sm mb-1 text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Fun Fact
                </h4>
                <p className="text-sm italic text-muted-foreground">
                  "{region.funFact}"
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <DrawerFooter className="pt-2 pb-6 border-t border-border/50">
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto mx-auto border-border/50 bg-background/50 hover:bg-muted">Close Details</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
