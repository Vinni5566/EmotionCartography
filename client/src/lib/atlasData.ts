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

export const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
export const monthGrowth: Record<string, Record<string, number>> = {
  JAN: { career: .75, family: .55, friends: .4, identity: .3, rest: .25, expectations: .15 },
  FEB: { career: .82, family: .58, friends: .48, identity: .34, rest: .2, expectations: .18 },
  MAR: { career: .7, family: .66, friends: .52, identity: .48, rest: .32, expectations: .28 },
  APR: { career: .62, family: .73, friends: .63, identity: .57, rest: .44, expectations: .41 },
  MAY: { career: .58, family: .7, friends: .68, identity: .66, rest: .58, expectations: .55 },
  JUN: { career: .6, family: .76, friends: .72, identity: .75, rest: .7, expectations: .68 },
};

export const getCluster = (id: string) => clusters.find((cluster) => cluster.id === id) ?? clusters[0];
export const getEntryCount = (id: string) => entries.filter((entry) => entry.clusterId === id).length;
