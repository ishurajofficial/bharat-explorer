'use client';

import { useMemo } from 'react';
import { useTravelStore } from '@/store/travel-store';
import { INDIA_REGIONS } from '@/data/india-states';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // We'll assume a basic Card component

export default function AnalyticsCharts() {
  const { visitedStates } = useTravelStore();

  const data = useMemo(() => {
    // 1. Region Data
    const regionCounts: Record<string, { total: number; visited: number }> = {
      north: { total: 0, visited: 0 },
      south: { total: 0, visited: 0 },
      east: { total: 0, visited: 0 },
      west: { total: 0, visited: 0 },
      central: { total: 0, visited: 0 },
      northeast: { total: 0, visited: 0 },
      island: { total: 0, visited: 0 },
    };

    // 2. Terrain Data
    const terrainCounts = {
      coastal: { name: 'Coastal', value: 0 },
      mountain: { name: 'Mountain', value: 0 },
      landlocked: { name: 'Landlocked', value: 0 },
    };

    INDIA_REGIONS.forEach((region) => {
      // Aggregate Regions
      if (regionCounts[region.region]) {
        regionCounts[region.region].total += 1;
        if (visitedStates.has(region.id)) {
          regionCounts[region.region].visited += 1;
        }
      }

      // Aggregate Terrains for visited
      if (visitedStates.has(region.id)) {
        if (region.isCoastal || region.isIsland) terrainCounts.coastal.value += 1;
        else if (region.isMountain) terrainCounts.mountain.value += 1;
        else terrainCounts.landlocked.value += 1;
      }
    });

    const regionData = Object.entries(regionCounts).map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      Visited: val.visited,
      Remaining: val.total - val.visited,
    }));

    const terrainData = [
      terrainCounts.coastal,
      terrainCounts.mountain,
      terrainCounts.landlocked,
    ].filter(t => t.value > 0);

    // 3. Radar Data (Tourism types - basic heuristic)
    // We count keyword matches in tourism strings
    const personaCounts = {
      Nature: 0,
      History: 0,
      Spiritual: 0,
      Beaches: 0,
      Wildlife: 0
    };

    INDIA_REGIONS.forEach((region) => {
      if (visitedStates.has(region.id)) {
        const text = region.tourism.join(' ').toLowerCase();
        if (text.includes('park') || text.includes('valley') || text.includes('hill')) personaCounts.Nature += 1;
        if (text.includes('fort') || text.includes('palace') || text.includes('monument')) personaCounts.History += 1;
        if (text.includes('temple') || text.includes('shrine') || text.includes('ghat')) personaCounts.Spiritual += 1;
        if (text.includes('beach') || text.includes('island')) personaCounts.Beaches += 1;
        if (text.includes('wildlife') || text.includes('tiger') || text.includes('sanctuary')) personaCounts.Wildlife += 1;
      }
    });

    const radarData = Object.entries(personaCounts).map(([key, val]) => ({
      subject: key,
      A: val,
      fullMark: Math.max(...Object.values(personaCounts), 5)
    }));

    return { regionData, terrainData, radarData };
  }, [visitedStates]);

  const COLORS = ['#FF9933', '#138808', '#000080']; // India flag colors

  if (visitedStates.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-2">No Data to Analyze</h3>
        <p className="text-muted-foreground text-center">
          Mark some states as visited on the dashboard to see your travel analytics!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Exploration by Region (Bar Chart) */}
      <div className="glass p-6 rounded-2xl border border-border/50 lg:col-span-2">
        <h3 className="font-bold text-lg mb-6">Exploration by Region</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.regionData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              <Bar dataKey="Visited" stackId="a" fill="#FF9933" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Remaining" stackId="a" fill="var(--muted)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Terrain Covered (Pie Chart) */}
      <div className="glass p-6 rounded-2xl border border-border/50">
        <h3 className="font-bold text-lg mb-6">Terrain Covered</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.terrainData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.terrainData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Travel Persona (Radar Chart) */}
      <div className="glass p-6 rounded-2xl border border-border/50">
        <h3 className="font-bold text-lg mb-6">Travel Persona</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
              <Radar
                name="Visits"
                dataKey="A"
                stroke="#138808"
                fill="#138808"
                fillOpacity={0.5}
              />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
