'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TravelNote {
  stateId: string;
  yearVisited?: number;
  monthVisited?: number;
  notes?: string;
  rating?: number;
  companion?: string;
  transport?: string;
}

export interface MapColors {
  visited: string;
  wishlist: string;
  notVisited: string;
  hover: string;
  border: string;
  background: string;
  ocean: string;
}

export interface UserProfile {
  name: string;
  avatar: string; // emoji or identifier
  uid?: string;
  email?: string | null;
  photoURL?: string | null;
  dob?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface TravelStore {
  // User
  user: UserProfile | null;

  // Core state
  visitedStates: Set<string>;
  wishlistStates: Set<string>;
  travelNotes: Record<string, TravelNote>;

  // Customization
  mapMode: 'visited' | 'wishlist';
  mapFilter: 'all' | 'coastal' | 'mountain' | 'northeast';
  mapColors: MapColors;
  theme: 'light' | 'dark' | 'system';
  showLabels: boolean;
  showBorders: boolean;
  animationsEnabled: boolean;

  // User Actions
  login: (name: string, avatar: string, uid?: string, email?: string | null, photoURL?: string | null) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  syncFromCloud: (data: any) => void;

  // Actions
  toggleVisited: (stateId: string) => void;
  toggleWishlist: (stateId: string) => void;
  setTravelNote: (stateId: string, note: Partial<TravelNote>) => void;
  setMapMode: (mode: 'visited' | 'wishlist') => void;
  setMapFilter: (filter: 'all' | 'coastal' | 'mountain' | 'northeast') => void;
  setMapColor: (key: keyof MapColors, value: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setShowLabels: (show: boolean) => void;
  setShowBorders: (show: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_MAP_COLORS: MapColors = {
  visited: '#FF9933',
  wishlist: '#e81cff', // Neon Pink/Purple for wishlist
  notVisited: '#334155', // Lighter slate for better contrast
  hover: '#138808',
  border: '#ffffff40', // Brighter border
  background: '#0a0a1a',
  ocean: '#1e293b', // Lighter navy background
};

const DEFAULT_STATE: Pick<
  TravelStore,
  | 'user'
  | 'visitedStates'
  | 'wishlistStates'
  | 'travelNotes'
  | 'mapMode'
  | 'mapFilter'
  | 'mapColors'
  | 'theme'
  | 'showLabels'
  | 'showBorders'
  | 'animationsEnabled'
> = {
  user: null,
  visitedStates: new Set<string>(),
  wishlistStates: new Set<string>(),
  travelNotes: {},
  mapMode: 'visited',
  mapFilter: 'all',
  mapColors: { ...DEFAULT_MAP_COLORS },
  theme: 'dark',
  showLabels: true,
  showBorders: true,
  animationsEnabled: true,
};

// ---------------------------------------------------------------------------
// Serialisation helpers  (Set <-> Array for JSON / localStorage)
// ---------------------------------------------------------------------------

interface SerializedState {
  user: UserProfile | null;
  visitedStates: string[];
  wishlistStates: string[];
  travelNotes: Record<string, TravelNote>;
  mapMode?: 'visited' | 'wishlist';
  mapFilter?: 'all' | 'coastal' | 'mountain' | 'northeast';
  mapColors: MapColors;
  theme: 'light' | 'dark' | 'system';
  showLabels: boolean;
  showBorders: boolean;
  animationsEnabled: boolean;
}

function serialize(state: TravelStore): SerializedState {
  return {
    user: state.user,
    visitedStates: Array.from(state.visitedStates),
    wishlistStates: Array.from(state.wishlistStates),
    travelNotes: state.travelNotes,
    mapMode: state.mapMode,
    mapFilter: state.mapFilter,
    mapColors: state.mapColors,
    theme: state.theme,
    showLabels: state.showLabels,
    showBorders: state.showBorders,
    animationsEnabled: state.animationsEnabled,
  };
}

function deserialize(raw: SerializedState): Omit<TravelStore, 'login' | 'logout' | 'updateProfile' | 'syncFromCloud' | 'toggleVisited' | 'toggleWishlist' | 'setTravelNote' | 'setMapMode' | 'setMapFilter' | 'setMapColor' | 'setTheme' | 'setShowLabels' | 'setShowBorders' | 'setAnimationsEnabled' | 'resetAll' | 'exportData' | 'importData'> {
  const mapColors = { ...DEFAULT_MAP_COLORS, ...(raw.mapColors ?? {}) };
  
  // Patch old dark colors to the new lighter ones for users with existing saves
  if (mapColors.ocean === '#0c1445') mapColors.ocean = '#1e293b';
  if (mapColors.notVisited === '#1a1a2e') mapColors.notVisited = '#334155';
  if (mapColors.border === '#ffffff20') mapColors.border = '#ffffff40';

  return {
    user: raw.user ?? null,
    visitedStates: new Set(raw.visitedStates ?? []),
    wishlistStates: new Set(raw.wishlistStates ?? []),
    travelNotes: raw.travelNotes ?? {},
    mapMode: raw.mapMode ?? 'visited',
    mapFilter: raw.mapFilter ?? 'all',
    mapColors,
    theme: raw.theme ?? 'dark',
    showLabels: raw.showLabels ?? true,
    showBorders: raw.showBorders ?? true,
    animationsEnabled: raw.animationsEnabled ?? true,
  };
}

// ---------------------------------------------------------------------------
// Validation helper for importData
// ---------------------------------------------------------------------------

function isValidImport(data: unknown): data is SerializedState {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.visitedStates)) return false;
  if (!obj.visitedStates.every((v: unknown) => typeof v === 'string')) return false;

  if (!Array.isArray(obj.wishlistStates)) return false;
  if (!obj.wishlistStates.every((v: unknown) => typeof v === 'string')) return false;

  if (typeof obj.travelNotes !== 'object' || obj.travelNotes === null) return false;

  if (typeof obj.mapColors !== 'object' || obj.mapColors === null) return false;
  const colorKeys: (keyof MapColors)[] = ['visited', 'wishlist', 'notVisited', 'hover', 'border', 'background', 'ocean'];
  for (const key of colorKeys) {
    if (typeof (obj.mapColors as Record<string, unknown>)[key] !== 'string' && key !== 'wishlist') return false; // allow wishlist to be missing in old exports
  }

  if (!['light', 'dark', 'system'].includes(obj.theme as string)) return false;
  if (typeof obj.showLabels !== 'boolean') return false;
  if (typeof obj.showBorders !== 'boolean') return false;
  if (typeof obj.animationsEnabled !== 'boolean') return false;

  return true;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useTravelStore = create<TravelStore>()(
  persist(
    (set, get) => ({
      // ---- initial state ----
      ...DEFAULT_STATE,

      // ---- user actions ----
      login: (name, avatar, uid, email, photoURL) => set({ user: { name, avatar, uid, email, photoURL } }),
      logout: () => set({ user: null }),
      updateProfile: (profileUpdates) => set((state) => {
        if (!state.user) return state;
        const nextUser = { ...state.user, ...profileUpdates };
        if (nextUser.uid) {
          setDoc(doc(db, 'users', nextUser.uid), {
            user: nextUser
          }, { merge: true });
        }
        return { user: nextUser };
      }),
      syncFromCloud: (data) => set((state) => ({
        visitedStates: new Set(data.visitedStates || []),
        wishlistStates: new Set(data.wishlistStates || []),
        travelNotes: data.travelNotes || {}
      })),

      // ---- actions ----

      toggleVisited: (stateId: string) =>
        set((state) => {
          const next = new Set(state.visitedStates);
          if (next.has(stateId)) {
            next.delete(stateId);
          } else {
            next.add(stateId);
          }
          
          if (state.user?.uid) {
            setDoc(doc(db, 'users', state.user.uid), {
              visitedStates: Array.from(next)
            }, { merge: true });
          }
          
          return { visitedStates: next };
        }),

      toggleWishlist: (stateId: string) =>
        set((state) => {
          const next = new Set(state.wishlistStates);
          if (next.has(stateId)) {
            next.delete(stateId);
          } else {
            next.add(stateId);
          }
          
          if (state.user?.uid) {
            setDoc(doc(db, 'users', state.user.uid), {
              wishlistStates: Array.from(next)
            }, { merge: true });
          }
          
          return { wishlistStates: next };
        }),

      setTravelNote: (stateId, note) =>
        set((state) => {
          const next = {
            ...state.travelNotes,
            [stateId]: { ...state.travelNotes[stateId], ...note, stateId },
          };
          
          if (state.user?.uid) {
            setDoc(doc(db, 'users', state.user.uid), {
              travelNotes: next
            }, { merge: true });
          }
          
          return { travelNotes: next };
        }),

      setMapMode: (mode) => set({ mapMode: mode }),
      setMapFilter: (filter) => set({ mapFilter: filter }),

      setMapColor: (key, value) =>
        set((state) => ({
          mapColors: { ...state.mapColors, [key]: value },
        })),

      setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),

      setShowLabels: (show: boolean) => set({ showLabels: show }),

      setShowBorders: (show: boolean) => set({ showBorders: show }),

      setAnimationsEnabled: (enabled: boolean) => set({ animationsEnabled: enabled }),

      resetAll: () =>
        set({
          user: null,
          visitedStates: new Set<string>(),
          wishlistStates: new Set<string>(),
          travelNotes: {},
          mapColors: { ...DEFAULT_MAP_COLORS },
          theme: 'dark',
          showLabels: true,
          showBorders: true,
          animationsEnabled: true,
        }),

      exportData: (): string => {
        const state = get();
        return JSON.stringify(serialize(state), null, 2);
      },

      importData: (json: string) => {
        try {
          const parsed: unknown = JSON.parse(json);

          if (!isValidImport(parsed)) {
            console.error('[BharatExplorer] importData: invalid data structure');
            return;
          }

          const hydrated = deserialize(parsed);
          set(hydrated);
        } catch (err) {
          console.error('[BharatExplorer] importData: failed to parse JSON', err);
        }
      },
    }),
    {
      name: 'bharat-explorer-travel',

      // Custom storage adapter to handle Set <-> Array conversion
      storage: {
        getItem: (name: string) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;

          try {
            const wrapper = JSON.parse(raw) as {
              state: SerializedState;
              version: number;
            };
            return {
              ...wrapper,
              state: deserialize(wrapper.state) as unknown as TravelStore,
            };
          } catch {
            return null;
          }
        },

        setItem: (name: string, value: { state: TravelStore; version?: number }) => {
          const serialized = {
            state: serialize(value.state),
            version: value.version ?? 0,
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },

        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);
