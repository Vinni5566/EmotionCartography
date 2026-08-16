import { AtlasEntry, clusters } from "./atlasData";

export type AnalysisResult = {
  clusterId: string;
  embedding: number[];
  language: "English" | "Hindi" | "Hinglish";
};

/**
 * A stub for the semantic engine that will eventually be replaced by a real ML backend
 * (e.g., OpenAI embeddings + UMAP dimensionality reduction + HDBSCAN clustering).
 * 
 * For the prototype, this uses simple keyword matching to assign clusters and generates
 * deterministic coordinates based on the text length.
 */
export async function analyzeEntry(text: string, fast: boolean = false): Promise<AnalysisResult> {
  // Simulate network processing time ("tracing the thread...")
  if (!fast) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const lowerText = text.toLowerCase();
  
  // Keyword-based deterministic clustering
  let clusterId = "expectations"; // default
  
  if (lowerText.includes("work") || lowerText.includes("job") || lowerText.includes("career") || lowerText.includes("boss") || lowerText.includes("ambition")) {
    clusterId = "career";
  } else if (lowerText.includes("mom") || lowerText.includes("dad") || lowerText.includes("family") || lowerText.includes("brother") || lowerText.includes("sister") || lowerText.includes("home")) {
    clusterId = "family";
  } else if (lowerText.includes("friend") || lowerText.includes("friends") || lowerText.includes("hang") || lowerText.includes("party")) {
    clusterId = "friends";
  } else if (lowerText.includes("rest") || lowerText.includes("sleep") || lowerText.includes("tired") || lowerText.includes("break") || lowerText.includes("slow")) {
    clusterId = "rest";
  } else if (lowerText.includes("myself") || lowerText.includes("who") || lowerText.includes("identity") || lowerText.includes("feel")) {
    clusterId = "identity";
  }
  
  // Simple language detection stub
  let language: "English" | "Hindi" | "Hinglish" = "English";
  if (/[ - ]/.test(text) && !/^[a-zA-Z\s]+$/.test(text)) {
    // If it contains non-english chars roughly
    language = "Hindi";
  }

  // Generate deterministic "embedding" coordinates for visual placement
  // In a real system, these would be 2D UMAP coordinates
  const cluster = clusters.find(c => c.id === clusterId) || clusters[0];
  const [cx, cy] = cluster.centroid;
  
  // Create a small offset based on string length and first char code
  const offset = (text.length * text.charCodeAt(0)) % 100;
  const rad = (offset / 100) * Math.PI * 2;
  const dist = 2 + ((text.length % 15) / 15) * 8; // Spread within 2-10% of centroid
  
  const ex = cx + Math.cos(rad) * dist;
  const ey = cy + Math.sin(rad) * dist;

  return {
    clusterId,
    language,
    embedding: [Number(ex.toFixed(2)), Number(ey.toFixed(2))]
  };
}
