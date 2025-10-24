# Obsidian - Design Tokens Reference

Complete reference for all design tokens available in the Obsidian design system.

---

## Color Palette

### Brand Colors (Primary)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-jet-black` | `#0D0D0D` | Primary background, headers |
| `--color-graphite` | `#3B3B3B` | Borders, secondary elements |
| `--color-electric-gray` | `#C1C1C1` | Muted text, labels |
| `--color-signal-amber` | `#F6C667` | Primary CTAs, highlights, brand accent |

### Extended Accent Palette

| Token | Value | RGB | Usage |
|-------|-------|-----|-------|
| `--color-deep-teal` | `#2c4b42` | (44,75,66) | Data viz (primary series), info states |
| `--color-burnt-sienna` | `#7d3c14` | (125,60,20) | Warning states, charts (series 4) |
| `--color-slate-gray` | `#3e3530` | (62,53,48) | Tertiary backgrounds, muted sections |
| `--color-desert-sand` | `#ba9a5d` | (186,154,93) | Secondary highlights, passive states, charts (series 3) |
| `--color-crimson-alert` | `#ec1b31` | (236,27,49) | Critical errors, urgent alerts (use sparingly) |

### Application Colors

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-bg` | `#0D0D0D` | Page background |
| `--color-surface` | `#1a1a1f` | Card backgrounds |
| `--color-surface-elevated` | `#24242a` | Elevated surfaces (modals, dropdowns) |
| `--color-border` | `#3B3B3B` | Standard borders |
| `--color-border-subtle` | `#2a2a2f` | Subtle dividers |
| `--color-text` | `#e8e8f0` | Primary text |
| `--color-text-muted` | `#C1C1C1` | Secondary text |
| `--color-text-subtle` | `#8a8a95` | Tertiary text, placeholders |
| `--color-primary` | `#F6C667` | Primary actions |
| `--color-primary-hover` | `#f4b84a` | Primary hover state |
| `--color-success` | `#10b981` | Success states |
| `--color-warning` | `#ba9a5d` | Warning states (using Desert Sand) |
| `--color-danger` | `#ec1b31` | Error states (using Crimson Alert) |
| `--color-info` | `#2c4b42` | Informational states (using Deep Teal) |

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-heading` | `'Inter'` + system fallbacks | All headings (H1-H6) |
| `--font-body` | `'IBM Plex Sans'` + fallbacks | Body text, UI elements |
| `--font-mono` | System mono stack | Code, monospace data |

### Font Sizes

| Token | Value | Usage Example |
|-------|-------|---------------|
| `--font-size-xs` | `13px` | Helper text, labels, timestamps |
| `--font-size-sm` | `14px` | Small body text, form labels |
| `--font-size-base` | `16px` | Standard body text |
| `--font-size-lg` | `18px` | Large body text, H3 |
| `--font-size-xl` | `20px` | Emphasis text, subheadings |
| `--font-size-2xl` | `24px` | H2 section headers |
| `--font-size-3xl` | `30px` | Large headings |
| `--font-size-4xl` | `36px` | H1 page titles |
| `--font-size-5xl` | `48px` | Hero headings |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-light` | `300` | Subtle emphasis |
| `--font-weight-normal` | `400` | Body text |
| `--font-weight-medium` | `500` | Medium emphasis |
| `--font-weight-semibold` | `600` | Strong emphasis |
| `--font-weight-bold` | `700` | Headings, very strong emphasis |
| `--font-weight-extrabold` | `800` | Display headings |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | `4px` | Tight spacing, icon gaps |
| `--spacing-sm` | `8px` | Button internal spacing, small gaps |
| `--spacing-md` | `16px` | Standard spacing between elements |
| `--spacing-lg` | `24px` | Card padding, section spacing |
| `--spacing-xl` | `32px` | Large section gaps |
| `--spacing-2xl` | `48px` | Major section separators |
| `--spacing-3xl` | `64px` | Page section spacing |

**Usage Pattern:**
- Padding: Use `var(--spacing-lg)` for card padding (24px)
- Margins: Use `var(--spacing-md)` for element gaps (16px)
- Gaps: Use `var(--spacing-sm)` for flex/grid gaps (8px)

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Small elements (badges, tags) |
| `--radius-md` | `8px` | Buttons, inputs |
| `--radius-lg` | `12px` | Cards, larger containers |
| `--radius-xl` | `16px` | Modal dialogs, featured elements |
| `--radius-full` | `9999px` | Fully rounded (pills, avatars) |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.5)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.5)` | Standard cards |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.5)` | Modals, popovers |
| `--shadow-glow-amber` | `0 4px 12px rgba(246, 198, 103, 0.25)` | Primary button hover, Signal Amber glow |
| `--shadow-glow-teal` | `0 4px 12px rgba(44, 75, 66, 0.25)` | Info elements, Deep Teal glow |

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `0.15s ease` | Quick interactions (hover effects) |
| `--transition-base` | `0.2s ease` | Standard transitions (buttons, links) |
| `--transition-slow` | `0.3s ease` | Smooth animations (modals, panels) |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-dropdown` | `1000` | Dropdown menus |
| `--z-sticky` | `1020` | Sticky headers/navigation |
| `--z-modal-backdrop` | `1040` | Modal backdrop overlay |
| `--z-modal` | `1050` | Modal dialogs |
| `--z-tooltip` | `1070` | Tooltips (highest) |

---

## Utility Classes

### Color Utilities

**Background Colors:**
- `.bg-deep-teal` - Deep Teal background
- `.bg-burnt-sienna` - Burnt Sienna background
- `.bg-slate-gray` - Slate Gray background
- `.bg-desert-sand` - Desert Sand background

**Text Colors:**
- `.text-deep-teal` - Deep Teal text
- `.text-burnt-sienna` - Burnt Sienna text
- `.text-desert-sand` - Desert Sand text
- `.text-crimson-alert` - Crimson Alert text

**Border Colors:**
- `.border-deep-teal` - Deep Teal border
- `.border-burnt-sienna` - Burnt Sienna border

### Chart Colors (Data Visualization)

Use these for consistent data visualization:

- `.chart-color-1` - Signal Amber (primary series)
- `.chart-color-2` - Deep Teal (secondary series)
- `.chart-color-3` - Desert Sand (tertiary series)
- `.chart-color-4` - Burnt Sienna (quaternary series)
- `.chart-color-5` - Electric Gray (fifth series)

### Status Indicators

- `.status-healthy` - Green (success)
- `.status-warning` - Desert Sand (warning)
- `.status-critical` - Crimson Alert (danger)
- `.status-info` - Deep Teal (info)

### Badge Variants

- `.badge-success` - Green badge for positive states
- `.badge-warning` - Desert Sand badge for warnings
- `.badge-danger` - Crimson Alert badge for errors
- `.badge-info` - Deep Teal badge for information

### Glow Effects

- `.glow-amber` - Signal Amber glow (for primary CTAs)
- `.glow-teal` - Deep Teal glow (for info elements)

### Surface Variations

- `.surface-elevated` - Elevated background (modals, dropdowns)
- `.surface-subtle` - Subtle card background with border

### Typography Utilities

**Font Sizes:**
- `.text-xs` - 13px
- `.text-sm` - 14px
- `.text-base` - 16px
- `.text-lg` - 18px
- `.text-xl` - 20px

**Font Weights:**
- `.font-medium` - 500 weight
- `.font-semibold` - 600 weight
- `.font-bold` - 700 weight

---

## Component Classes

### Buttons

```css
.btn - Base button styles
.btn-primary - Signal Amber button (primary actions)
.btn-secondary - Graphite button (secondary actions)
```

**Example:**
```html
<button class="btn btn-primary glow-amber">Get Started Free →</button>
```

### Cards

```css
.card - Standard card with surface background and border
```

**Example:**
```html
<div class="card">
  <h3 class="text-lg font-semibold">Card Title</h3>
  <p class="text-sm text-muted">Card content...</p>
</div>
```

### Inputs

```css
.input - Text input field
```

**Example:**
```html
<input type="email" class="input" placeholder="Enter your email" />
```

### Badges

```css
.badge - Base badge styles
.badge-success - Green badge
.badge-warning - Desert Sand badge
.badge-danger - Crimson Alert badge
.badge-info - Deep Teal badge
```

**Example:**
```html
<span class="badge badge-success">Available Now</span>
<span class="badge badge-warning">Phase 2</span>
```

---

## Usage Examples

### Primary CTA Button
```html
<button class="btn btn-primary glow-amber">
  Connect HubSpot →
</button>
```

### Warning Alert Card
```html
<div class="card border-burnt-sienna">
  <h3 class="text-lg font-semibold text-burnt-sienna">
    Revenue at Risk: $847K
  </h3>
  <p class="text-sm text-muted">
    23 deals have been stalled for more than 30 days.
  </p>
</div>
```

### Data Visualization Legend
```html
<div style="display: flex; gap: var(--spacing-md);">
  <span class="chart-color-1">Pipeline Health</span>
  <span class="chart-color-2">Revenue Forecast</span>
  <span class="chart-color-3">Deal Velocity</span>
</div>
```

### Status Indicator
```html
<div class="badge badge-danger">
  <span class="status-critical">Critical</span>
  <span class="text-xs">23 zombie deals</span>
</div>
```

---

## Best Practices

### Color Usage

1. **Signal Amber** - Use for primary CTAs, highlights, and brand moments
2. **Deep Teal** - Use for data visualizations (primary series), info states
3. **Burnt Sienna** - Use for warning states, secondary alerts
4. **Desert Sand** - Use for secondary highlights, passive states
5. **Crimson Alert** - Use sparingly, only for critical errors

### Typography Hierarchy

1. **H1 (36px, Inter Bold)** - Page titles
2. **H2 (24px, Inter Bold)** - Section headers
3. **H3 (18px, Inter Semibold)** - Card titles
4. **Body (16px, IBM Plex Sans)** - Main content
5. **Small (14px)** - Labels, metadata
6. **Caption (13px)** - Helper text

### Spacing Consistency

- Use spacing scale tokens instead of arbitrary values
- Maintain consistent padding across all cards (24px)
- Use 16px as standard gap between elements
- Double spacing for major sections (48px)

### Shadows and Depth

- Cards: `var(--shadow-sm)` for subtle elevation
- Buttons on hover: `var(--shadow-glow-amber)` for emphasis
- Modals: `var(--shadow-lg)` for strong separation

---

## Implementation Notes

- All tokens are defined in `/obsidian-ai/apps/web/src/styles/globals.css`
- Use CSS custom properties syntax: `var(--token-name)`
- Prefer design tokens over hardcoded values for consistency
- New components should use existing utility classes when possible

---

*Last Updated: 2025-10-24*
*For brand guidelines, see: `/obsidian-business-docs/Brand_Guidelines.md`*
*For design principles, see: `/DESIGN_PRINCIPLES.md`*
