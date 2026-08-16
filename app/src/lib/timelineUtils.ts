import { AtlasEntry, clusters } from "./atlasData";

export interface TimelineState {
  date: string; // The date string (YYYY-MM-DD)
  entriesUntilDate: AtlasEntry[];
  activeClusters: Record<string, { count: number; weight: number }>; // themeId -> count
  connections: Record<string, { strength: number }>; // "clusterId1|clusterId2" -> strength
  milestones: TimelineMilestone[];
}

export interface TimelineMilestone {
  id: string;
  date: string;
  type: "first_appearance" | "new_connection" | "recurring_theme";
  label: string;
  description: string;
  themeIds: string[];
}

export function computeTimelineStates(entries: AtlasEntry[]): TimelineState[] {
  // Sort entries chronologically
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const states: TimelineState[] = [];
  const activeClusters: Record<string, number> = {};
  const connectionCounts: Record<string, number> = {};
  const seenDates = new Set<string>();
  const milestones: TimelineMilestone[] = [];

  let currentEntries: AtlasEntry[] = [];

  for (const entry of sorted) {
    currentEntries.push(entry);

    // Update clusters
    const primaryCluster = entry.clusterId;
    if (!activeClusters[primaryCluster]) {
      activeClusters[primaryCluster] = 0;
      milestones.push({
        id: `m-first-${primaryCluster}-${entry.id}`,
        date: entry.date,
        type: "first_appearance",
        label: "FIRST APPEARANCE",
        description: `${getLabel(primaryCluster)} appeared for the first time.`,
        themeIds: [primaryCluster],
      });
    }
    activeClusters[primaryCluster]++;

    if (activeClusters[primaryCluster] === 5) {
      milestones.push({
        id: `m-recur-${primaryCluster}-${entry.id}`,
        date: entry.date,
        type: "recurring_theme",
        label: "RECURRING THREAD",
        description: `${getLabel(primaryCluster)} has become a recurring theme.`,
        themeIds: [primaryCluster],
      });
    }

    // Update connections based on tags (if they exist)
    const themesInEntry = Array.from(new Set([primaryCluster, ...(entry.tags ?? [])].filter(t => t !== "reflection" && clusters.some(c => c.id === t))));
    
    // Create pairs
    for (let i = 0; i < themesInEntry.length; i++) {
      for (let j = i + 1; j < themesInEntry.length; j++) {
        const pair = [themesInEntry[i], themesInEntry[j]].sort().join("|");
        if (!connectionCounts[pair]) {
          connectionCounts[pair] = 0;
          milestones.push({
            id: `m-conn-${pair}-${entry.id}`,
            date: entry.date,
            type: "new_connection",
            label: "NEW CONNECTION",
            description: `${getLabel(themesInEntry[i])} and ${getLabel(themesInEntry[j])} appeared together for the first time.`,
            themeIds: [themesInEntry[i], themesInEntry[j]],
          });
        }
        connectionCounts[pair]++;
      }
    }

    // We take a snapshot per unique date.
    if (!seenDates.has(entry.date) || entry === sorted[sorted.length - 1]) {
      seenDates.add(entry.date);
      
      const stateClusters: Record<string, { count: number; weight: number }> = {};
      
      for (const [id, count] of Object.entries(activeClusters)) {
        stateClusters[id] = { count, weight: count };
      }

      const stateConns: Record<string, { strength: number }> = {};
      const maxConn = Math.max(...Object.values(connectionCounts), 1);
      for (const [pair, count] of Object.entries(connectionCounts)) {
        stateConns[pair] = { strength: count / maxConn };
      }

      const stateMilestones = milestones.filter(m => m.date === entry.date);

      states.push({
        date: entry.date,
        entriesUntilDate: [...currentEntries],
        activeClusters: stateClusters,
        connections: stateConns,
        milestones: stateMilestones,
      });
    }
  }

  return states;
}

function getLabel(id: string) {
  return clusters.find(c => c.id === id)?.label ?? id.toUpperCase();
}
