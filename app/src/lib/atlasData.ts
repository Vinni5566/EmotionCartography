/* EmotionCartography / Cartographer's Field Journal
   Domain layer only: replace these arrays with FastAPI responses later without changing UI contracts.
*/
export type AtlasEntry = {
  id: string;
  text: string;
  date: string;
  clusterId: string;
  language: "English" | "Hindi" | "Hinglish";
  embedding: number[];
  bookmarked?: boolean;
  tags?: string[];
  createdAt?: string;
};

export type AtlasCluster = {
  id: string;
  label: string;
  entryIds: string[];
  centroid: [number, number];
  regionGeometry: string;
  interpretation: string;
  color: string;
  discovered?: boolean;
};

export type AtlasConnection = {
  sourceClusterId: string;
  targetClusterId: string;
  strength: number;
  entryIds: string[];
  route: string;
  description: string;
};

export type AtlasReflection = {
  id: string;
  type: "recurring" | "theme" | "emerging" | "shift";
  themeIds: string[];
  evidenceEntryIds: string[];
  observation: string;
  question: string;
  userResponseId?: string; // Links to an AtlasEntry ID if they respond
  createdAt: string;
  hidden?: boolean;
  saved?: boolean;
  metadata?: {
    firstSeen?: string;
    lastSeen?: string;
    entryCount?: number;
  };
};

const seeds: Record<string, { label: string; color: string; interpretation: string; geometry: string; discovered?: boolean }> = {
  career: { label: "CAREER", color: "#b97857", interpretation: "A highland of momentum, ambition, and the questions that follow you uphill.", geometry: "25,31" },
  family: { label: "FAMILY", color: "#78916f", interpretation: "A green country of old paths and the stories we carry forward.", geometry: "68,25" },
  friends: { label: "FRIENDS", color: "#778da3", interpretation: "A constellation of chosen proximity, laughter, and the people who make room.", geometry: "18,58" },
  identity: { label: "IDENTITY", color: "#8981a4", interpretation: "A reflective region where the outline of the self keeps changing with the light.", geometry: "78,69" },
  rest: { label: "REST", color: "#6f9e9c", interpretation: "A low valley of stillness—the place your map keeps asking you to visit.", geometry: "32,74" },
  expectations: { label: "EXPECTATIONS", color: "#c4a05c", interpretation: "A newly discovered pass between familiar territories, where outside voices become visible.", geometry: "51,49", discovered: true },
};

const texts: Record<string, string[]> = {
  career: ["The work I want to be proud of", "A different pace", "What success costs", "I keep postponing the brave version", "The meeting stayed with me", "Maybe ambition is not urgency", "I want a room with windows", "A good day at work felt quiet", "What would enough look like?", "The route I chose is still mine", "I saw my old self in the elevator", "The project is not the whole story", "I want to make something useful", "There is a softer way to be excellent"],
  family: ["The rituals we inherited", "A room I return to", "Learning to stay", "I called home on the way back", "Some silences are older than me", "The recipe is a map too", "I heard my mother's question in my voice", "A familiar road after a long year", "Love has its own weather", "The things we never name", "I want to visit without performing", "The house remembers our footsteps", "What I carry is not all mine", "I am learning a new kind of closeness"],
  friends: ["The people who make room", "A laugh I had forgotten", "It is okay to be witnessed", "We walked without a plan", "The group chat became a small country", "Someone noticed I was quiet", "A friendship can change shape", "I want less proving, more presence", "The long way home with company", "We are allowed to grow apart", "A table where everyone brings weather", "The message arrived at the right hour", "I felt like myself around them"],
  identity: ["Who I am becoming", "The version no one sees", "A name for this feeling", "I tried on a different future", "My body is not a question to solve", "The mirror was kinder today", "I am more than the useful parts", "There are many ways to belong", "A boundary is also a door", "I want to speak in my own accent", "The old label does not fit", "I felt present in my own life", "A self can be a moving thing"],
  rest: ["A slower morning", "The permission to pause", "Nothing to prove", "I let the day arrive first", "The book stayed open beside me", "Rest is not the reward at the end", "I went outside without an objective", "A quiet room felt generous", "My attention returned", "I slept before I was exhausted", "There is work in listening", "The river did not hurry", "I want to protect this margin"],
  expectations: ["Should I?", "Their idea of me", "The route I did not choose", "I keep hearing an invisible audience", "What if I disappoint the plan?", "The future arrived wearing someone else's coat", "I want to want this", "Maybe the pressure has a history", "Who benefits from my hurry?", "I could make a different promise", "The question underneath the question", "I am allowed to revise the map", "Not every open door is mine"],
};

const languages: AtlasEntry["language"][] = ["English", "English", "English", "Hinglish", "Hindi"];
export const entries: AtlasEntry[] = Object.entries(texts).flatMap(([clusterId, list]) => list.map((text, index) => ({
  id: `${clusterId}-${String(index + 1).padStart(2, "0")}`,
  text,
  date: `2026-${String((index % 6) + 1).padStart(2, "0")}-${String((index * 3 % 26) + 1).padStart(2, "0")}`,
  clusterId,
  language: languages[index % languages.length],
  embedding: [Number((0.18 + index * 0.027).toFixed(3)), Number((0.64 - index * 0.019).toFixed(3)), Number((0.32 + (index % 4) * 0.08).toFixed(3))],
})));

export const clusters: AtlasCluster[] = Object.entries(seeds).map(([id, seed]) => ({ id, label: seed.label, color: seed.color, interpretation: seed.interpretation, regionGeometry: seed.geometry, entryIds: entries.filter((entry) => entry.clusterId === id).map((entry) => entry.id), centroid: seed.geometry.split(",").map(Number) as [number, number], discovered: seed.discovered ?? false }));

const shared = (a: string, b: string) => entries.filter((entry) => entry.clusterId === a || entry.clusterId === b).slice(1, 8).map((entry) => entry.id);
export const connections: AtlasConnection[] = [
  { sourceClusterId: "career", targetClusterId: "family", strength: 0.82, entryIds: shared("career", "family"), route: "M 250 160 C 390 100, 470 240, 680 132", description: "These themes appear together in 7 entries." },
  { sourceClusterId: "career", targetClusterId: "expectations", strength: 0.68, entryIds: shared("career", "expectations"), route: "M 250 160 C 350 220, 420 250, 510 276", description: "The climb and the pass meet in 6 entries." },
  { sourceClusterId: "family", targetClusterId: "expectations", strength: 0.74, entryIds: shared("family", "expectations"), route: "M 680 132 C 610 170, 580 225, 510 276", description: "Inherited paths and outside voices meet in 5 entries." },
  { sourceClusterId: "identity", targetClusterId: "rest", strength: 0.56, entryIds: shared("identity", "rest"), route: "M 780 386 C 620 470, 460 450, 320 414", description: "Stillness gives the self room to change in 4 entries." },
];

export const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
export const monthGrowth: Record<string, Record<string, number>> = {
  JAN: { career: .75, family: .55, friends: .4, identity: .3, rest: .25, expectations: .15 },
  FEB: { career: .82, family: .58, friends: .48, identity: .34, rest: .2, expectations: .18 },
  MAR: { career: .7, family: .66, friends: .52, identity: .48, rest: .32, expectations: .28 },
  APR: { career: .62, family: .73, friends: .63, identity: .57, rest: .44, expectations: .41 },
  MAY: { career: .58, family: .7, friends: .68, identity: .66, rest: .58, expectations: .55 },
  JUN: { career: .6, family: .76, friends: .72, identity: .75, rest: .7, expectations: .68 },
  JUL: { career: .65, family: .8, friends: .75, identity: .8, rest: .75, expectations: .72 },
  AUG: { career: .7, family: .85, friends: .8, identity: .85, rest: .8, expectations: .78 },
};

export const getCluster = (id: string) => clusters.find((cluster) => cluster.id === id) ?? clusters[0];
export const getEntryCount = (id: string) => entries.filter((entry) => entry.clusterId === id).length;

/* DEMO ARCHIVE · SYNTHETIC ENTRIES
   These are illustrative, non-real records used only in the interactive field journal demo.
   They are never presented as actual user data. */
export const demoEntries: AtlasEntry[] = [
  { id: "demo-01", text: "Mom asked again if I've applied for the internship.", date: "2026-02-14", clusterId: "family", language: "English", embedding: [0.4, 0.7, 0.3] },
  { id: "demo-02", text: "I keep wondering whether I actually want this career.", date: "2026-02-21", clusterId: "career", language: "English", embedding: [0.6, 0.5, 0.4] },
  { id: "demo-03", text: "Everyone seems to know where they're going except me.", date: "2026-02-28", clusterId: "identity", language: "English", embedding: [0.5, 0.6, 0.5] },
  { id: "demo-04", text: "Called my friend after weeks. It felt strangely normal.", date: "2026-03-07", clusterId: "friends", language: "English", embedding: [0.3, 0.8, 0.4] },
  { id: "demo-05", text: "Dad asked when I'm going to start earning.", date: "2026-03-15", clusterId: "expectations", language: "English", embedding: [0.7, 0.4, 0.6] },
  { id: "demo-06", text: "I haven't slept properly this week.", date: "2026-03-21", clusterId: "rest", language: "English", embedding: [0.2, 0.9, 0.3] },
  { id: "demo-07", text: "Spent the afternoon doing absolutely nothing and actually enjoyed it.", date: "2026-03-27", clusterId: "rest", language: "English", embedding: [0.3, 0.8, 0.5] },
  { id: "demo-08", text: "The job listing looked exactly like what I said I wanted. I didn't apply.", date: "2026-04-02", clusterId: "career", language: "English", embedding: [0.6, 0.5, 0.3] },
  { id: "demo-09", text: "I think I'm performing 'fine' for everyone around me.", date: "2026-04-08", clusterId: "identity", language: "English", embedding: [0.5, 0.6, 0.6] },
  { id: "demo-10", text: "My sister graduated. I felt proud and something else I can't name.", date: "2026-04-14", clusterId: "family", language: "English", embedding: [0.4, 0.7, 0.4] },
  { id: "demo-11", text: "I want to work on something I believe in, not just something impressive.", date: "2026-04-19", clusterId: "career", language: "English", embedding: [0.7, 0.4, 0.4] },
  { id: "demo-12", text: "The comparison spiral started again while I was on my phone.", date: "2026-04-25", clusterId: "expectations", language: "English", embedding: [0.6, 0.5, 0.7] },
  { id: "demo-13", text: "Hadn't seen my friends in months. The awkwardness dissolved in about two minutes.", date: "2026-05-01", clusterId: "friends", language: "English", embedding: [0.3, 0.7, 0.5] },
  { id: "demo-14", text: "I read for two hours. Felt like water to a plant.", date: "2026-05-07", clusterId: "rest", language: "English", embedding: [0.2, 0.8, 0.4] },
  { id: "demo-15", text: "Someone asked what I'm passionate about. I didn't know what to say.", date: "2026-05-13", clusterId: "identity", language: "English", embedding: [0.5, 0.5, 0.6] },
  { id: "demo-16", text: "Dinner with the family was louder than I remembered. I was glad.", date: "2026-05-18", clusterId: "family", language: "English", embedding: [0.4, 0.8, 0.3] },
  { id: "demo-17", text: "The mentor meeting helped. She said something I'll sit with for a while.", date: "2026-05-24", clusterId: "career", language: "English", embedding: [0.7, 0.5, 0.3] },
  { id: "demo-18", text: "I said no to a plan I didn't want to go to. Didn't feel guilty. Progress.", date: "2026-05-30", clusterId: "identity", language: "English", embedding: [0.5, 0.6, 0.7] },
  { id: "demo-19", text: "I keep chasing the version of myself that doesn't need approval.", date: "2026-06-05", clusterId: "expectations", language: "English", embedding: [0.6, 0.4, 0.7] },
  { id: "demo-20", text: "Woke up without an alarm. The morning felt like it belonged to me.", date: "2026-06-11", clusterId: "rest", language: "English", embedding: [0.2, 0.9, 0.4] },
  { id: "demo-21", text: "My friend got a promotion. I was genuinely happy and a little scared.", date: "2026-06-17", clusterId: "friends", language: "English", embedding: [0.4, 0.6, 0.6] },
  { id: "demo-22", text: "The presentation went well. No one knows how close I came to cancelling it.", date: "2026-06-23", clusterId: "career", language: "English", embedding: [0.7, 0.4, 0.3] },
  { id: "demo-23", text: "Ma called twice. I didn't pick up the first time. I should have.", date: "2026-06-29", clusterId: "family", language: "English", embedding: [0.4, 0.7, 0.5] },
  { id: "demo-24", text: "I don't know if I'm doing the right thing, or just the expected thing.", date: "2026-07-05", clusterId: "expectations", language: "English", embedding: [0.6, 0.5, 0.8] },
  { id: "demo-25", text: "Walked without headphones for the first time in months. Strange and good.", date: "2026-07-11", clusterId: "rest", language: "English", embedding: [0.3, 0.8, 0.3] },
  { id: "demo-26", text: "I want a life that feels mine, not assembled from other people's expectations.", date: "2026-07-15", clusterId: "identity", language: "English", embedding: [0.5, 0.5, 0.8] },
  { id: "demo-27", text: "An old friend reached out after two years. We talked for three hours.", date: "2026-07-19", clusterId: "friends", language: "English", embedding: [0.3, 0.7, 0.6] },
  { id: "demo-28", text: "Dad smiled when I told him about the project. I hadn't expected that.", date: "2026-07-23", clusterId: "family", language: "English", embedding: [0.4, 0.8, 0.4] },
  { id: "demo-29", text: "I almost quit but finished the thing. It exists now. That matters.", date: "2026-07-27", clusterId: "career", language: "English", embedding: [0.7, 0.5, 0.4] },
  { id: "demo-30", text: "I think rest has been the hardest thing to let myself have.", date: "2026-07-31", clusterId: "rest", language: "English", embedding: [0.2, 0.9, 0.5] },
  { id: "demo-31", text: "I don't know if I'm chasing this career because I want it, or want to be seen wanting it.", date: "2026-08-04", clusterId: "expectations", language: "English", embedding: [0.6, 0.4, 0.8] },
  { id: "demo-32", text: "Something about the way my friends laughed made me feel like myself again.", date: "2026-08-07", clusterId: "friends", language: "English", embedding: [0.3, 0.7, 0.5] },
  { id: "demo-33", text: "The hard conversation happened. We are still here. That means something.", date: "2026-08-10", clusterId: "family", language: "English", embedding: [0.4, 0.7, 0.6] },
  { id: "demo-34", text: "I keep returning to the same question: what would I do if no one was watching?", date: "2026-08-13", clusterId: "identity", language: "English", embedding: [0.5, 0.5, 0.7] },
  { id: "demo-35", text: "The deadline passed and I survived it. I always forget I survive them.", date: "2026-08-17", clusterId: "career", language: "English", embedding: [0.7, 0.5, 0.5] },
];

export const demoReflections: AtlasReflection[] = [
  {
    id: "reflection-01",
    type: "recurring",
    themeIds: ["career", "family"],
    evidenceEntryIds: ["demo-11", "demo-22", "demo-29", "demo-10", "demo-16", "demo-23", "demo-28"],
    observation: "Career and Family appear together across 7 field notes.",
    question: "You've written about career and family together several times. What, if anything, do you notice about that connection?",
    createdAt: "2026-08-16T10:00:00Z",
    metadata: { firstSeen: "MAR 09", lastSeen: "JUN 16", entryCount: 7 }
  },
  {
    id: "reflection-02",
    type: "recurring",
    themeIds: ["identity", "expectations"],
    evidenceEntryIds: ["demo-03", "demo-09", "demo-26", "demo-34", "demo-19"],
    observation: "Identity and Expectations appear together across 5 field notes.",
    question: "When the shape of yourself and the expectations of others appear together, where does the pressure usually come from?",
    createdAt: "2026-08-16T11:00:00Z",
    metadata: { firstSeen: "JAN 18", lastSeen: "JUL 03", entryCount: 5 }
  },
  {
    id: "reflection-03",
    type: "emerging",
    themeIds: ["rest", "career"],
    evidenceEntryIds: ["demo-06", "demo-30", "demo-02", "demo-35"],
    observation: "Rest and Career are beginning to intersect. This thread was first seen recently and has appeared in 4 entries since.",
    question: "It seems rest is becoming more connected to how you think about work. What feels different about this recently?",
    createdAt: "2026-08-16T12:00:00Z",
    metadata: { firstSeen: "FEB 08", lastSeen: "JUL 07", entryCount: 4 }
  },
  {
    id: "reflection-04",
    type: "theme",
    themeIds: ["friends", "family"],
    evidenceEntryIds: ["demo-04", "demo-21", "demo-32"],
    observation: "Friends and Family occasionally share space in the same thoughts across 3 entries.",
    question: "When these close relationships overlap in your writing, is there a shared feeling you're returning to?",
    createdAt: "2026-08-16T13:00:00Z",
    metadata: { firstSeen: "JAN 25", lastSeen: "JUN 27", entryCount: 3 }
  },
  {
    id: "reflection-05",
    type: "shift",
    themeIds: ["career", "expectations"],
    evidenceEntryIds: ["demo-08", "demo-17", "demo-12", "demo-24", "demo-31"],
    observation: "Earlier entries often mention career alongside decisions. More recent entries mention career alongside expectations.",
    question: "Your thoughts on work seem increasingly tied to invisible audiences. Does that feel true to your recent experience?",
    createdAt: "2026-08-16T14:00:00Z",
    metadata: { firstSeen: "FEB 20", lastSeen: "JUN 24", entryCount: 5 }
  }
];

