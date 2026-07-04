'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTravelStore } from '@/store/travel-store';
import { INDIA_MAP_DATA } from '@/data/india-svg-paths';
import { INDIA_REGIONS, IndiaRegion } from '@/data/india-states';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Move } from 'lucide-react';

interface IndiaMapProps {
  className?: string;
  onStateClick?: (stateId: string) => void;
  onStateHover?: (stateId: string | null) => void;
}

const getRegionData = (id: string): IndiaRegion | undefined => {
  return INDIA_REGIONS.find((r) => r.id === id);
};

export default function IndiaMap({ className, onStateClick, onStateHover }: IndiaMapProps) {
  const { 
    visitedStates, 
    wishlistStates, 
    toggleVisited, 
    toggleWishlist, 
    mapMode, 
    mapFilter,
    mapColors,
    showBorders,
    showLabels,
    animationsEnabled
  } = useTravelStore();

  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [labelCoords, setLabelCoords] = useState<Record<string, {x: number, y: number}>>({});

  useEffect(() => {
    // Calculate centroids for labels after initial render
    const timer = setTimeout(() => {
      const coords: Record<string, {x: number, y: number}> = {};
      INDIA_MAP_DATA.locations.forEach(location => {
        const el = document.getElementById(location.id) as any;
        if (el && el.getBBox) {
          const bbox = el.getBBox();
          coords[location.id] = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2
          };
        }
      });
      setLabelCoords(coords);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Zoom and Pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleFitScreen = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const aspectRatio = containerRect.width / containerRect.height;
      const targetScale = aspectRatio > 1 ? containerRect.height / 700 : containerRect.width / 600;
      setScale(Math.max(targetScale * 0.9, 0.5));
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click for drag
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const updateTooltipPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    const tooltipWidth = 240;
    const tooltipHeight = 180;
    
    let offsetX = 15;
    let offsetY = 15;

    if (x + offsetX + tooltipWidth > rect.width) {
      offsetX = -tooltipWidth - 15;
    }
    if (y + offsetY + tooltipHeight > rect.height) {
      offsetY = -tooltipHeight - 15;
    }

    setTooltipPos({ x: x + offsetX, y: y + offsetY });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }

    if (hoveredState) {
      updateTooltipPosition(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeaveContainer = () => setIsDragging(false);

  const onPathMouseEnter = (id: string, e: React.MouseEvent) => {
    setHoveredState(id);
    updateTooltipPosition(e.clientX, e.clientY);
    if (onStateHover) onStateHover(id);
  };

  const onPathMouseLeave = () => {
    setHoveredState(null);
    if (onStateHover) onStateHover(null);
  };

  const handleStateClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mapMode === 'visited') {
      toggleVisited(id);
    } else {
      toggleWishlist(id);
    }
    if (onStateClick) {
      onStateClick(id);
    }
  };

  const hoveredRegionData = useMemo(() => {
    if (!hoveredState) return null;
    return getRegionData(hoveredState);
  }, [hoveredState]);

  const numberFormatter = new Intl.NumberFormat('en-IN');

  return (
    <div
      ref={containerRef}
      className={`india-map-container rounded-2xl overflow-hidden relative select-none ${className || ''}`}
      style={{ backgroundColor: mapColors.ocean }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeaveContainer}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        animate={{ scale, x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={INDIA_MAP_DATA.viewBox}
          className="w-full max-w-[800px] h-auto drop-shadow-2xl"
        >
          {INDIA_MAP_DATA.locations.map((location, i) => {
            const isVisited = visitedStates.has(location.id);
            const isWishlist = wishlistStates.has(location.id);
            const isHovered = hoveredState === location.id;

            let fillColor = mapColors.notVisited;
            const region = getRegionData(location.id);
            
            // Handle Filters
            let isFilteredOut = false;
            if (mapFilter !== 'all' && region) {
              if (mapFilter === 'coastal' && !region.isCoastal) isFilteredOut = true;
              if (mapFilter === 'mountain' && !region.isMountain) isFilteredOut = true;
              if (mapFilter === 'northeast' && region.region !== 'northeast') isFilteredOut = true;
            }

            // Priority: Hover > Visited > Wishlist
            if (isHovered) {
              fillColor = mapColors.hover;
            } else if (isVisited) {
              fillColor = mapColors.visited;
            } else if (isWishlist) {
              fillColor = mapColors.wishlist;
            }

            const opacity = isFilteredOut ? 0.2 : 1;

            return (
              <motion.path
                key={location.id}
                d={location.path}
                id={location.id}
                name={location.name}
                initial={animationsEnabled ? { opacity: 0, scale: 0.95 } : { opacity, scale: 1 }}
                animate={{
                  opacity: opacity,
                  scale: isHovered ? 1.01 : 1,
                  fill: fillColor,
                }}
                transition={animationsEnabled ? {
                  opacity: { delay: i * 0.01, duration: 0.3 },
                  scale: { duration: 0.2 },
                  fill: { duration: 0.3 }
                } : { duration: 0 }}
                stroke={showBorders ? mapColors.border : 'transparent'}
                strokeWidth={showBorders ? "0.5" : "0"}
                strokeLinejoin="round"
                className={`outline-none ${isHovered ? 'z-10 relative drop-shadow-md' : ''}`}
                onMouseEnter={(e) => onPathMouseEnter(location.id, e as unknown as React.MouseEvent)}
                onMouseLeave={onPathMouseLeave}
                onClick={(e) => handleStateClick(location.id, e as unknown as React.MouseEvent)}
              />
            );
          })}
          
          {/* Render Labels */}
          {showLabels && INDIA_MAP_DATA.locations.map((location) => {
            const coords = labelCoords[location.id];
            if (!coords) return null;
            const region = getRegionData(location.id);
            if (!region) return null;
            return (
              <text
                key={`label-${location.id}`}
                x={coords.x}
                y={coords.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                className="text-[6px] fill-foreground pointer-events-none select-none font-bold drop-shadow-sm"
              >
                {region.name}
              </text>
            );
          })}
        </svg>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
        <div className="glass rounded-lg p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleFitScreen}
            className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
            title="Fit Screen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <div className="glass rounded-lg p-2 flex items-center justify-center text-muted-foreground" title="Pan">
          <Move className="w-5 h-5" />
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredRegionData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="map-tooltip absolute rounded-xl p-4 shadow-xl text-sm min-w-[220px]"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              backgroundColor: 'var(--glass)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-foreground text-sm">{hoveredRegionData.name}</span>
              {visitedStates.has(hoveredRegionData.id) ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-500/20 text-green-500">
                  Visited
                </span>
              ) : wishlistStates.has(hoveredRegionData.id) ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-400">
                  Wishlist
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                  Not Visited
                </span>
              )}
            </div>
            <div className="text-muted-foreground text-xs mb-3">{hoveredRegionData.type === 'ut' ? 'Union Territory' : 'State'}</div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-muted-foreground">Capital</div>
              <div className="font-medium text-right text-foreground">{hoveredRegionData.capital}</div>

              <div className="text-muted-foreground">Area</div>
              <div className="font-medium text-right text-foreground">{numberFormatter.format(hoveredRegionData.area)} km²</div>

              <div className="text-muted-foreground">Population</div>
              <div className="font-medium text-right text-foreground">{numberFormatter.format(hoveredRegionData.population)}</div>

              <div className="text-muted-foreground">Language</div>
              <div className="font-medium text-right text-foreground">{hoveredRegionData.language}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
