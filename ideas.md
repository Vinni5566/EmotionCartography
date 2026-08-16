# EmotionCartography — Design Direction

## Three stylistic approaches

### Theme Name: Cartographer's Field Journal
Very Brief Intro: A living atlas of memory and meaning, rendered through parchment, ink, contour lines, and editorial typography. The interface feels discovered rather than assembled.
Probability: 0.07

### Theme Name: Nocturne Observatory
Very Brief Intro: A quiet midnight instrument panel where themes glow like constellations over a dark vellum sky. Reflective, precise, and atmospheric without becoming futuristic.
Probability: 0.04

### Theme Name: Tidal Archive
Very Brief Intro: A coastal archive where emotional patterns arrive as tide charts, washed ink, and layered translucent paper. Softer and more fluid, with a contemplative editorial rhythm.
Probability: 0.08

## Selected approach: Cartographer's Field Journal

### Design Movement
Contemporary editorial cartography: the material language of antique exploration maps, the narrative pacing of a literary field journal, and the clarity of modern data visualization.

### Core Principles
- **Map first, interface second:** every major section should feel like a place, route, annotation, or page in an atlas.
- **Old material, current meaning:** parchment, contour ink, and imperfect marks coexist with crisp controls and legible interaction feedback.
- **Depth through layers:** background terrain, middle-ground landmarks, foreground annotations, and UI overlays move at distinct speeds.
- **Discovery over persuasion:** copy invites noticing and reflection rather than selling or diagnosing.

### Color Philosophy
Warm parchment and aged ivory create a grounded surface that feels personal and archival. Muted greens, slate blues, lavender, ochre, and terracotta identify regions without creating a loud categorical dashboard. A controlled electric cyan marks live connections and active discovery; it is used sparingly so it feels like a signal rather than a gradient.

### Layout Paradigm
A scrollable atlas rather than a stack of marketing sections. Wide panoramic compositions, offset journal sheets, diagonal routes, and pinned map moments create an asymmetric journey. Content can sit at the edge of the illustration like a margin note, while the map remains the dominant spatial object.

### Signature Elements
- Fine contour lines and route dashes that connect concepts across sections.
- Tiny coordinate stamps, compass ticks, and uppercase cartographic labels as navigational punctuation.
- Warm paper panels with clipped corners and inked borders, used selectively instead of rounded UI cards.

### Interaction Philosophy
Interactions should feel like examining a map with a magnifying glass: hover reveals nearby relationships, selection moves the camera toward a region, and zoom/pan preserve a sense of physical place. Controls are quiet and tactile, with clear focus states and no decorative motion without cause.

### Animation
Use slow atmospheric parallax for landscape layers, subtle drifting clouds, and measured path-drawing for connections. Narrative transformations should stage in order: fragments gather, points cluster, boundaries appear, then labels resolve. UI responses stay under 260ms with a crisp ease-out; ambient motion is slower and pauses under reduced-motion preferences.

### Typography System
Display: Cormorant Garamond, with large editorial headings using restrained tracking and a mix of regular/semibold weights. UI/body: DM Sans for clarity at small sizes. Cartographic labels: uppercase DM Sans with wide tracking, plus occasional italic Cormorant notes. Hierarchy should feel like a book title, chapter marker, margin note, and field annotation—not a SaaS dashboard.

### Brand Essence
EmotionCartography is a reflective journal-to-map experience for people who want to see the themes shaping their lives, because patterns become more actionable when they can be explored as a landscape. Personality: **curious, grounded, quietly luminous**.

### Brand Voice
Headlines are precise, literary, and slightly mysterious. CTAs are invitations to look closer. Microcopy is observational, never clinical or overpromising.

Example lines:
- “Your journal is more than an archive. It contains a landscape.”
- “Follow the thread that keeps returning.”

### Wordmark & Logo
The mark is a small compass rose crossed with a river delta: four tapered points contain a single meandering line that suggests both orientation and an unfolding thought. The wordmark is set in a refined serif with a custom crossbar on the A, but the symbol carries the identity on its own.

### Signature Brand Color
**Signal Cyan — #70C8C3.** A mineral, slightly weathered cyan used for active connections and moments of recognition; it reads as a living signal against paper, not as a synthetic glow.

## Style Decisions

- Use a warm, light cartographic surface with deep ink text; reserve dark ink-blue panels for contrast and map focus states.
- Prominent visual areas must use original generated illustrations; supporting detail can be composed with CSS/SVG.
- Avoid generic rounded cards, centered SaaS hero layouts, purple gradients, and filler testimonials.
- Every major section must either reveal a new layer of the map or explain how the map is formed.

## Ground-truth brief notes

The experience is a cinematic, interactive atlas of the user's inner world. The main prototype will include a parallax hero, narrative “fragments to landscape” sequence, a real SVG-based interactive map with zoom/pan/hover/click behavior, and an entry detail panel. It should feel like self-discovery rather than therapy, gamification, or enterprise analytics.
