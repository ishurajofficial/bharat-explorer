'use client';

import { useState, useEffect } from 'react';
import { useTravelStore } from '@/store/travel-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star, Save } from 'lucide-react';

export default function DiaryForm({ stateId }: { stateId: string }) {
  const { travelNotes, setTravelNote } = useTravelStore();
  const note = travelNotes[stateId] || {};

  const [year, setYear] = useState(note.yearVisited?.toString() || '');
  const [month, setMonth] = useState(note.monthVisited?.toString() || '');
  const [rating, setRating] = useState(note.rating || 0);
  const [notes, setNotes] = useState(note.notes || '');
  const [companion, setCompanion] = useState(note.companion || '');
  const [transport, setTransport] = useState(note.transport || '');

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Reset form when stateId changes
    const currentNote = travelNotes[stateId] || {};
    setYear(currentNote.yearVisited?.toString() || '');
    setMonth(currentNote.monthVisited?.toString() || '');
    setRating(currentNote.rating || 0);
    setNotes(currentNote.notes || '');
    setCompanion(currentNote.companion || '');
    setTransport(currentNote.transport || '');
    setSaved(false);
  }, [stateId, travelNotes]);

  const handleSave = () => {
    setTravelNote(stateId, {
      yearVisited: year ? parseInt(year) : undefined,
      monthVisited: month ? parseInt(month) : undefined,
      rating,
      notes,
      companion,
      transport
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass p-5 rounded-2xl border border-border/50 space-y-4">
      <h3 className="font-bold flex items-center justify-between">
        Travel Memory
        {saved && <span className="text-xs text-green-500 font-normal">Saved!</span>}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Year Visited</label>
          <Input 
            type="number" 
            placeholder="e.g. 2023" 
            value={year} 
            onChange={e => setYear(e.target.value)}
            className="bg-background/50 h-8"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Month (1-12)</label>
          <Input 
            type="number" 
            min="1" max="12"
            placeholder="e.g. 12" 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            className="bg-background/50 h-8"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              onClick={() => setRating(star)}
              className={`w-6 h-6 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30 hover:text-muted-foreground'}`} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Travel Companions</label>
        <Input 
          placeholder="e.g. Family, Friends, Solo" 
          value={companion} 
          onChange={e => setCompanion(e.target.value)}
          className="bg-background/50 h-8"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Notes & Memories</label>
        <textarea 
          placeholder="What did you love about this place?" 
          value={notes} 
          onChange={e => setNotes(e.target.value)}
          className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
        />
      </div>

      <Button onClick={handleSave} className="w-full h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
        <Save className="w-4 h-4" />
        Save Memory
      </Button>
    </div>
  );
}
