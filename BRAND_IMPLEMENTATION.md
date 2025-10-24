# Obsidian Brand Implementation

This document shows how the Obsidian brand guidelines have been implemented in the application.

---

## Brand Guidelines Applied

Based on [Brand_Guidelines.md](obsidian-business-docs/Brand_Guidelines.md), the following elements have been integrated:

### ✅ **Color Palette**

| Brand Color | Hex Code | CSS Variable | Usage |
|-------------|----------|--------------|-------|
| **Jet Black** | `#0D0D0D` | `--color-jet-black` | Primary background |
| **Graphite** | `#3B3B3B` | `--color-graphite` | Borders, dividers |
| **Electric Gray** | `#C1C1C1` | `--color-electric-gray` | Muted text, secondary content |
| **Signal Amber** | `#F6C667` | `--color-signal-amber` | Primary CTA, highlights, interactive elements |

### ✅ **Typography**

| Element | Font Family | Weight | Usage |
|---------|-------------|--------|-------|
| **Headlines (H1-H6)** | Inter | Bold (700) | All page titles, section headers |
| **Body Text** | IBM Plex Sans | Regular (400) | Paragraphs, descriptions, content |
| **Monospace** | System Mono | Regular (400) | Code snippets, technical details |

**Font Loading:**
- Fonts are loaded via Google Fonts in [_app.tsx](obsidian-ai/apps/web/src/pages/_app.tsx)
- Preconnected for optimal performance
- Includes weights: 300, 400, 500, 600, 700, 800

### ✅ **Design System Implementation**

**File:** [globals.css](obsidian-ai/apps/web/src/styles/globals.css)

**Key Components:**
- `.btn-primary` — Signal Amber background with Jet Black text
- `.btn-secondary` — Graphite borders with subtle hover states
- `.card` — Surface with Graphite borders, minimal contrast
- `.input` — Jet Black background with Graphite borders

---

## Brand Voice & Messaging

### Mission (from Brand Guidelines)
> "We restore order to the revenue pipeline — helping teams recover what they've already earned."

**Implemented in:**
- Landing page hero section
- Footer tagline
- Meta description

### Tagline
> *Precision in motion.*

**Implemented in:**
- Could be added to header or footer
- Recommended for loading states

### Core Principles

1. **Discipline > Hustle** ✅ Implemented on landing page
2. **Outcome > Noise** ✅ Implemented on landing page
3. **Signal > Vanity** ✅ Implemented on landing page

---

## Visual Language

### Design Mood
- ✅ **Minimal contrast** — Jet Black (#0D0D0D) to Graphite (#3B3B3B)
- ✅ **Geometric spacing** — Consistent 8px grid system
- ✅ **Subtle gradients** — Used sparingly for motion & precision

### Motion & Animation
- Button hover states: `translateY(-1px)` with Signal Amber glow
- Smooth transitions: `0.2s ease`
- Calm glide → impact → resolve

---

## Brand Architecture (Units)

The five core units from your brand guidelines:

| Unit | Purpose | Implementation Status |
|------|---------|----------------------|
| **Vanguard** | Discovery + trial onboarding | ✅ Pages built |
| **Command** | Integrity + task enforcement | ✅ API routes ready |
| **Scribe** | Narrative + explainability | ✅ Report page ready |
| **Evidence** | Proof + ROI storytelling | ⏳ To be built |
| **Interface** | UX + trust wall | ✅ Trust contract page |

---

## Voice & Style Rules

### ✅ Applied Throughout UI

1. **Educational Tone**
   - "Discover revenue at risk, pipeline health, and revival opportunities"
   - "See every signal, weight, and threshold"

2. **Assertive + Respectful**
   - "No credit card required • 30-day trial included"
   - "We never store raw CRM data"

3. **Collaborative**
   - "Let's" instead of "You should"
   - "We've identified..." instead of "You have..."

4. **Voice Rules**
   - ✅ Always "We," never "I"
   - ✅ Explain, don't lecture
   - ✅ Confidence > hype
   - ✅ End with clarity or next steps

---

## Where Brand is Applied

### Landing Page ([index.tsx](obsidian-ai/apps/web/src/pages/index.tsx))
- ✅ Mission statement
- ✅ Core principles (Discipline > Hustle, etc.)
- ✅ Signal Amber CTAs
- ✅ "How it works" with numbered steps
- ✅ Footer with tagline

### Trust Contract ([trust-contract.tsx](obsidian-ai/apps/web/src/pages/onboarding/trust-contract.tsx))
- ✅ No raw CRM storage promise
- ✅ Explainable signals guarantee
- ✅ Educational tone throughout
- ✅ Clear next steps

### Diagnostic Report ([report.tsx](obsidian-ai/apps/web/src/pages/dashboard/report.tsx))
- ✅ Explainable signals with math revealed on click
- ✅ Confidence index displayed prominently
- ✅ Revival forecast with probability
- ✅ Signal Amber highlights for key metrics

---

## Color Usage Guidelines

### Primary Actions
- **Background:** Signal Amber (`#F6C667`)
- **Text:** Jet Black (`#0D0D0D`)
- **Hover:** Lighter amber with subtle glow

### Secondary Actions
- **Background:** Surface (`#1a1a1f`)
- **Border:** Graphite (`#3B3B3B`)
- **Hover:** Slightly lighter graphite

### Status Colors
- **Success:** Green (`#10b981`)
- **Warning:** Amber (`#f59e0b`)
- **Danger:** Red (`#ef4444`)

---

## Typography Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 48px | 700 | 1.2 |
| H2 | 36px | 700 | 1.3 |
| H3 | 28px | 700 | 1.4 |
| H4 | 24px | 600 | 1.4 |
| Body | 15px | 400 | 1.6 |
| Small | 13px | 400 | 1.5 |

---

## Logo Concept (from Brand Guidelines)

**Not yet implemented:**
> Monoline "O" ring with inner fracture line — representing clarity under pressure

**Recommendation:**
Create SVG logo and place in:
- `/public/logo.svg`
- `/public/logo-white.svg` (for dark backgrounds)

**Usage:**
- Header navigation
- Email templates
- Loading states
- Favicon

---

## Brand Consistency Checklist

When adding new features, ensure:

- [ ] Primary CTAs use Signal Amber
- [ ] Headlines use Inter Bold
- [ ] Body text uses IBM Plex Sans
- [ ] Voice is educational and collaborative
- [ ] Explainability is prioritized (show the math)
- [ ] Backgrounds use Jet Black
- [ ] Borders use Graphite
- [ ] Hover states include subtle motion
- [ ] Language follows "We" not "I"
- [ ] Every insight includes reasoning

---

## Future Brand Enhancements

### Recommended Additions

1. **Animated Logo** — Fracture line animation on load
2. **Micro-interactions** — Subtle glows on Signal Amber elements
3. **Loading States** — "Precision in motion" tagline
4. **Email Templates** — Branded magic link emails
5. **Social Cards** — Open Graph images with brand colors
6. **Illustrations** — Volcanic glass texture, fracture patterns
7. **Icon Set** — Custom icons matching brand aesthetic

### Brand Evolution

As the product grows:
- Consider adding tertiary accent colors
- Develop illustration style guide
- Create motion design principles
- Build component library documentation

---

## Resources

- [Brand Guidelines](obsidian-business-docs/Brand_Guidelines.md) — Full brand specification
- [Product Charter](obsidian-business-docs/Obsidian_Product_Charter.md) — Product vision
- [globals.css](obsidian-ai/apps/web/src/styles/globals.css) — Design system implementation

---

**Brand Status:** ✅ Core brand elements implemented and ready for development
