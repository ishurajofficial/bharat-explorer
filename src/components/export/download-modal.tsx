'use client';

import { useState } from 'react';
import { Download, FileImage, FileType2, FileCode2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTravelStore } from '@/store/travel-store';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapElementId?: string; // The ID of the container to capture
}

export default function DownloadModal({ isOpen, onClose, mapElementId = 'india-map-capture' }: DownloadModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { exportData } = useTravelStore();

  const handleDownloadImage = async (type: 'png' | 'jpeg') => {
    try {
      setIsExporting(true);
      const element = document.getElementById(mapElementId);
      if (!element) throw new Error('Map element not found');

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        backgroundColor: 'var(--ocean)',
        scale: 2, // High resolution
        logging: false,
        useCORS: true,
      });

      const url = canvas.toDataURL(`image/${type}`, 1.0);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bharat-explorer-map.${type}`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      const element = document.getElementById(mapElementId);
      if (!element) throw new Error('Map element not found');

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, {
        backgroundColor: 'var(--ocean)',
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save('bharat-explorer-map.pdf');
    } catch (err) {
      console.error('PDF Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bharat-explorer-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('JSON Export failed:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass sm:max-w-md border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="w-5 h-5 text-primary" />
            Export Map & Data
          </DialogTitle>
          <DialogDescription>
            Download your personalized India map or export your data to transfer to another device.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 glass border-border/50 hover:bg-muted/50 transition-all group"
            onClick={() => handleDownloadImage('png')}
            disabled={isExporting}
          >
            <FileImage className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>High-Res PNG</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 glass border-border/50 hover:bg-muted/50 transition-all group"
            onClick={() => handleDownloadImage('jpeg')}
            disabled={isExporting}
          >
            <FileImage className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
            <span>JPEG Image</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 glass border-border/50 hover:bg-muted/50 transition-all group"
            onClick={handleDownloadPDF}
            disabled={isExporting}
          >
            <FileType2 className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
            <span>PDF Document</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 glass border-border/50 hover:bg-muted/50 transition-all group"
            onClick={handleDownloadJSON}
            disabled={isExporting}
          >
            <FileCode2 className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span>Backup Data (JSON)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
