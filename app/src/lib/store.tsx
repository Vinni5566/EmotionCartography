import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AtlasEntry,
  AtlasCluster,
  AtlasConnection,
  entries as demoEntries,
  clusters as demoClusters,
  connections as demoConnections,
  demoReflections,
  AtlasReflection
} from "./atlasData";

const STORAGE_KEY = "emotionCartography.v2";

export type CartographyData = {
  entries: AtlasEntry[];
  themes: AtlasCluster[];
  connections: AtlasConnection[];
  reflections: AtlasReflection[];
};

type StoreContextType = {
  data: CartographyData;
  isCustomized: boolean;
  addEntry: (entry: AtlasEntry) => void;
  updateEntry: (entryId: string, updates: Partial<AtlasEntry>) => void;
  deleteEntry: (entryId: string) => void;
  updateTheme: (themeId: string, updates: Partial<AtlasCluster>) => void;
  addConnection: (connection: AtlasConnection) => void;
  updateReflection: (reflectionId: string, updates: Partial<AtlasReflection>) => void;
  resetCartography: () => void;
  
  // Draft Recovery
  draft: string | null;
  saveDraft: (text: string) => void;
  clearDraft: () => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function CartographyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CartographyData | null>(null);

  const [draft, setDraft] = useState<string | null>(null);

  useEffect(() => {
    // Hydrate on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate: seed reflections if not present (for existing stored data)
        if (!parsed.reflections || parsed.reflections.length === 0) {
          parsed.reflections = demoReflections;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse stored cartography data, resetting.", e);
        seedDemoData();
      }
    } else {
      seedDemoData();
    }

    // Hydrate draft
    const storedDraft = localStorage.getItem(`${STORAGE_KEY}.draft`);
    if (storedDraft) {
      setDraft(storedDraft);
    }
  }, []);

  const seedDemoData = () => {
    const initialData: CartographyData = {
      entries: demoEntries,
      themes: demoClusters,
      connections: demoConnections,
      reflections: demoReflections,
    };
    setData(initialData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  };

  const saveToStorage = (newData: CartographyData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addEntry = (entry: AtlasEntry) => {
    if (!data) return;
    const newData = { ...data, entries: [...data.entries, entry] };
    saveToStorage(newData);
  };

  const updateEntry = (entryId: string, updates: Partial<AtlasEntry>) => {
    if (!data) return;
    const newData = {
      ...data,
      entries: data.entries.map((e) => (e.id === entryId ? { ...e, ...updates } : e))
    };
    saveToStorage(newData);
  };

  const deleteEntry = (entryId: string) => {
    if (!data) return;
    const newData = { ...data, entries: data.entries.filter(e => e.id !== entryId) };
    saveToStorage(newData);
  };

  const updateTheme = (themeId: string, updates: Partial<AtlasCluster>) => {
    if (!data) return;
    const newThemes = data.themes.map((t) => (t.id === themeId ? { ...t, ...updates } : t));
    const newData = { ...data, themes: newThemes };
    saveToStorage(newData);
  };

  const addConnection = (connection: AtlasConnection) => {
    if (!data) return;
    const newData = { ...data, connections: [...data.connections, connection] };
    saveToStorage(newData);
  };

  const updateReflection = (reflectionId: string, updates: Partial<AtlasReflection>) => {
    if (!data) return;
    const newReflections = data.reflections.map(r => r.id === reflectionId ? { ...r, ...updates } : r);
    const newData = { ...data, reflections: newReflections };
    saveToStorage(newData);
  };

  const resetCartography = () => {
    seedDemoData();
  };

  const saveDraft = (text: string) => {
    setDraft(text);
    localStorage.setItem(`${STORAGE_KEY}.draft`, text);
  };

  const clearDraft = () => {
    setDraft(null);
    localStorage.removeItem(`${STORAGE_KEY}.draft`);
  };

  if (!data) return null; // Wait for hydration
  
  // Customization means user added an entry or deleted a demo entry
  const isCustomized = data.entries.length !== demoEntries.length || 
    data.entries.some(e => !demoEntries.find(d => d.id === e.id));

  return (
    <StoreContext.Provider value={{ 
      data, isCustomized, addEntry, updateEntry, deleteEntry, 
      updateTheme, addConnection, updateReflection, resetCartography,
      draft, saveDraft, clearDraft
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useCartography() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useCartography must be used within CartographyProvider");
  return ctx;
}
