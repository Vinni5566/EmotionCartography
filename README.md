# EmotionCartography

> **Your journal is an archive. EmotionCartography turns it into a living map.**
**[▶️ Watch the Demo](https://drive.google.com/file/d/1BWysK30xIIrvPKtLGlSZ19C6-USVZ0kR/view?usp=sharing)**

EmotionCartography is a spatial journaling platform that transforms personal writing into a **dynamic semantic landscape**. Instead of reducing reflection to mood scores or chronological lists, it reveals recurring themes, relationships, and changes hidden across your own words—giving you a new way to explore how your writing evolves over time.

> **We don't tell you how you're supposed to feel. We help you notice how your own experiences are already connected.**

---

## The Problem

Journaling is powerful, but its structure rarely changes.

You write entry after entry. Months later, those thoughts become an archive—**chronological, searchable, but difficult to interpret as a whole.**

Recurring themes get buried. Connections between different parts of life remain invisible. A career concern might repeatedly appear alongside family conversations, or a theme that once dominated your writing may gradually become less prominent.

Most digital journaling tools respond with **mood scores, summaries, or AI advice**.

But self-reflection isn't necessarily an advice problem.

**It's a discovery problem.**

The patterns already exist in what people write. The challenge is making those patterns visible.

---

## Our Solution

**EmotionCartography reimagines a journal as an atlas.**

Every field note becomes part of a living semantic landscape. Related entries naturally gather into regions, while recurring relationships between themes form visible connections.

Instead of asking:

> *"How am I feeling?"*

EmotionCartography lets you explore:

> *"What keeps appearing in my own words?"*

> *"What themes keep showing up together?"*

> *"How has that landscape changed over time?"*

The result isn't a diagnosis, a score, or an AI telling you what your life means.

**It's a map of the patterns already present in your writing.**

---

## The Core Experience

### WRITE → DISCOVER → EXPLORE → REFLECT → EVOLVE

### 01 — Write

Capture a thought as a **field note**, naturally and without forcing it into categories or mood labels.

### 02 — Discover

Semantic processing identifies relationships between the new entry and your existing writing.

### 03 — Explore

Your entries become an interactive landscape of semantic regions, connections, and individual field notes.

### 04 — Reflect

Explore a recurring connection, inspect the actual journal evidence behind it, and receive an open-ended reflection prompt.

### 05 — Evolve

As new entries arrive, the landscape changes. The **Timeline** lets you travel through that evolution and watch the map reorganize itself.

---

## Product Experience

### 📝 Journal — Capture the Field Notes

A focused writing environment designed around the act of journaling rather than dashboards and metrics.

Write naturally. Your entries become the raw material for your personal atlas.

---

### 🗺️ The Living Map — See Your Writing Spatially

The map transforms journal entries into a navigable semantic landscape.

Related thoughts gather together.

Themes become regions.

Connections emerge between recurring themes.

Individual entries remain accessible as the evidence behind the landscape.

**The map isn't decoration—it is the primary representation of the data.**

---

### 🔎 Reflections — Investigate the Threads

Reflections turns discovered relationships into evidence-backed observations.

For example:

**CAREER ↔ FAMILY**

*7 field notes*

Instead of simply generating an AI interpretation, EmotionCartography lets you inspect the actual entries contributing to that connection.

Then it asks an open question:

> *"What, if anything, do you notice about this connection?"*

The user decides what the pattern means.

---

### ⏳ Timeline — Watch the Landscape Evolve

The Timeline turns the map into a journey through time.

Scrub backward and forward to watch:

- themes emerge
- regions grow or recede
- connections appear
- recurring threads strengthen
- new semantic regions form

The goal isn't to show whether you became "better" or "worse."

**It shows how your writing changed.**

---

## What Makes It Different

Traditional journaling tools primarily organize writing **by time**.

Tagging systems organize writing **by categories chosen by the user**.

AI journaling tools often turn writing into **conversation, summaries, scores, or advice**.

EmotionCartography takes a different approach:

| Traditional Approach | EmotionCartography |
|---|---|
| Chronological entries | Spatial + temporal exploration |
| Manual tags | Automatically discovered semantic structure |
| Mood scores | No psychological scoring |
| AI advice | Evidence-backed observation |
| Static analysis | Living, evolving landscape |
| AI tells you what you feel | Your own writing remains the evidence |
| Folders/categories | Organic semantic regions |

The key distinction:

> **The user doesn't manually organize their life. The structure emerges from the writing itself.**

---

## How It Works

```text
                    JOURNAL ENTRY
                         │
                         ▼
                Semantic Representation
                         │
                         ▼
                  Vector Embedding
                         │
                         ▼
              ┌─────────────────────┐
              │  Dimensionality     │
              │  Reduction (UMAP)   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     Clustering      │
              │     (HDBSCAN)       │
              └──────────┬──────────┘
                         │
                         ▼
              Semantic Themes & Links
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
             MAP    REFLECTIONS   TIMELINE
