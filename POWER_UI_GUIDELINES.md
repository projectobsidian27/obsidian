# Obsidian - Power UI Design Guidelines

**Philosophy: Power, Control, and Function**

This document outlines the design principles and patterns that create Obsidian's command-and-control interface - built for RevOps professionals who demand precision, clarity, and authority.

---

## Core Philosophy

**Power** - Users feel in control of complex data and workflows
**Control** - Every interaction is predictable and purposeful
**Function** - Form follows function; no decoration without purpose

---

## 1. Visual Authority Through Typography

### Hierarchy That Commands Attention

```css
H1 - 36px, Inter Extrabold, -0.03em letter-spacing
H2 - 24px, Inter Bold, -0.02em letter-spacing
H3 - 18px, Inter Semibold, -0.02em letter-spacing
Body - 16px, IBM Plex Sans, 1.5 line-height
```

**Why:** Tight letter-spacing on large headings creates visual density and authority. The contrast between geometric Inter (headings) and humanist IBM Plex Sans (body) establishes clear command hierarchy.

### Metric Displays - Precision First

```html
<div class="metric">
  <div class="metric-value">$847K</div>
  <div class="metric-label">REVENUE AT RISK</div>
  <div class="metric-delta metric-delta-negative">-12.4%</div>
</div>
```

**Principles:**
- Large, bold numbers (30px+) demand attention
- UPPERCASE labels with wide letter-spacing (0.05em) signal importance
- Monospace deltas ensure number alignment

---

## 2. Interaction Precision

### Focus States - Keyboard Command Priority

All interactive elements support keyboard navigation with **clear, visible focus rings**:

```css
--focus-ring: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary)
```

**Visual Pattern:** Black inner ring + Amber outer ring creates unmissable focus indicator

**Why:** Power users rely on keyboard shortcuts. Every interactive element must announce its focused state clearly.

### Button States - Tactile Feedback

```css
Primary Button Hover: translateY(-2px) + amber glow
Primary Button Active: translateY(0) + no shadow
```

**Principle:** Buttons "lift" on hover and "press down" on click, creating physical metaphor for digital control.

### Hover States - Instant Response

All interactive elements respond within **150ms** (--transition-fast):
- Cards: Border darkens from #3B3B3B → darker graphite
- Inputs: Border highlights before focus
- Table rows: Background tint appears

**Why:** Instant visual feedback confirms the system is responsive and under user control.

---

## 3. Functional Density

### Data Tables - Information First

```html
<table class="table">
  <thead>
    <th>DEAL NAME</th>
    <th>OWNER</th>
    <th>HEALTH</th>
    <th>ACTIONS</th>
  </thead>
  <tbody>
    <tr>
      <td>Enterprise License Renewal</td>
      <td>Sarah Chen</td>
      <td><span class="status-pill status-pill-danger">CRITICAL</span></td>
      <td><button class="btn btn-secondary">Review</button></td>
    </tr>
  </tbody>
</table>
```

**Principles:**
- Dense 14px body text maximizes information per screen
- UPPERCASE table headers with wide letter-spacing (0.05em)
- 2px bold border under headers creates clear visual separation
- Row hover + focus-within states for keyboard navigation

### Grid Layouts - Command Panels

```css
.grid-command {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}
```

**Why:** Fixed-width sidebar (280px) for navigation/filters + fluid main content area mimics command-line interfaces and developer tools.

---

## 4. Status Communication

### High-Visibility Status Pills

```html
<span class="status-pill status-pill-danger">CRITICAL</span>
<span class="status-pill status-pill-warning">AT RISK</span>
<span class="status-pill status-pill-success">HEALTHY</span>
```

**Design Decisions:**
- UPPERCASE text for maximum legibility
- 2px border in status color creates strong visual boundary
- 15% opacity background tint maintains dark theme
- Semibold weight (600) for authority

### Semantic Color System

| Status | Color | Usage |
|--------|-------|-------|
| Success | #10b981 (Green) | Healthy pipelines, completed actions |
| Warning | #ba9a5d (Desert Sand) | At-risk deals, needs attention |
| Danger | #ec1b31 (Crimson Alert) | Critical issues, zombie deals |
| Info | #2c4b42 (Deep Teal) | Informational states, data insights |

**Principle:** Colors convey meaning instantly - no need to read labels for critical information.

---

## 5. Keyboard Navigation

### Power User Shortcuts

Visual indicators for keyboard commands:

```html
<span class="kbd">⌘</span> + <span class="kbd">K</span> - Command Palette
<span class="kbd">?</span> - Show Keyboard Shortcuts
```

**Design:**
- Monospace font for technical precision
- Shadow effect creates "physical key" appearance
- Small, unobtrusive until needed

### Tab Navigation Flow

1. All interactive elements support **Tab** navigation
2. **Shift + Tab** reverses direction
3. **Enter** activates buttons and links
4. **Escape** closes modals and overlays

**Visual Priority:**
- Focused elements receive amber focus ring
- Table rows support arrow key navigation (future)
- Modal traps focus until dismissed

---

## 6. Command Panel Pattern

### Structure

```html
<div class="command-panel">
  <div class="command-panel-header">
    PIPELINE FILTERS
  </div>
  <div class="command-panel-body">
    <!-- Filter controls -->
  </div>
</div>
```

**Visual Characteristics:**
- Dark header (Jet Black #0D0D0D) with UPPERCASE title
- 2px border separator creates strong division
- Body uses surface color for contrast

**Why:** Mimics terminal/IDE panel structure - familiar to technical users and conveys authority.

---

## 7. Borders and Separation

### Border Weights Signal Importance

```css
1px borders - Default (cards, inputs)
2px borders - Important (buttons, table headers, command panels)
--border-sharp: 2px - For critical boundaries
```

**Principle:** Thicker borders = higher importance. Users can scan visual weight to understand hierarchy.

### Color Coding Borders

- Default: `--color-border` (#3B3B3B - Graphite)
- Subtle: `--color-border-subtle` (#2a2a2f - Barely visible)
- Focused: `--color-primary` (#F6C667 - Signal Amber)
- Danger: `--color-danger` (#ec1b31 - Crimson Alert)

---

## 8. Spacing as Communication

### Spacing Scale Purpose

| Token | Value | Usage | Meaning |
|-------|-------|-------|---------|
| `--spacing-xs` | 4px | Icon gaps | Tight relationship |
| `--spacing-sm` | 8px | Button internals | Connected elements |
| `--spacing-md` | 16px | Standard gaps | Related content |
| `--spacing-lg` | 24px | Card padding | Contained sections |
| `--spacing-xl` | 32px | Section dividers | Separate concepts |
| `--spacing-2xl` | 48px | Major sections | Different contexts |

**Why:** Consistent spacing creates visual rhythm. Power users subconsciously learn these relationships and can scan faster.

---

## 9. Shadows and Depth

### Minimal, Purposeful Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5) - Subtle elevation
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5) - Standard cards
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5) - Modals, overlays
```

**Principle:** Shadows indicate z-axis position, not decoration. Use sparingly to maintain functional aesthetic.

### Glow Effects - Interactive Highlights

```css
--shadow-glow-amber: 0 4px 12px rgba(246, 198, 103, 0.25)
--shadow-glow-teal: 0 4px 12px rgba(44, 75, 66, 0.25)
```

**Usage:**
- Amber glow on primary button hover
- Teal glow for info/success states

**Why:** Colored glows draw attention to interactive elements without breaking dark theme.

---

## 10. Error Prevention and Recovery

### Input Validation States

```css
Default: 2px border, gray (#3B3B3B)
Hover: Border darkens (visual affordance)
Focus: Amber border + subtle glow
Error: Red border + error message below
Success: Green border (optional, use sparingly)
```

### Error Messages - Clear, Actionable

**Bad:** "Error 500"
**Good:** "Couldn't connect to HubSpot. Please try again or contact support."

**Principles:**
- Plain language, no error codes
- Explain what went wrong
- Suggest next action
- Red text (#ec1b31) for visibility

---

## 11. Accessibility as Control

### WCAG 2.1 AA Compliance

| Element | Contrast Ratio | Requirement |
|---------|---------------|-------------|
| Primary text (#e8e8f0) on dark (#0D0D0D) | 12:1 | ✅ Pass (4.5:1 required) |
| Signal Amber (#F6C667) on dark | 8.2:1 | ✅ Pass |
| Muted text (#C1C1C1) on dark | 7.1:1 | ✅ Pass |

### Keyboard Accessibility Checklist

- [x] All interactive elements are keyboard accessible
- [x] Tab order follows visual hierarchy
- [x] Focus indicators are clearly visible (4px amber ring)
- [x] No keyboard traps (modals can be dismissed with Escape)
- [x] Skip links for long forms (future)

### Screen Reader Support

- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`)
- ARIA labels for icon-only buttons
- Status announcements for loading states
- Table headers properly associated with cells

---

## 12. Animation Principles

### Speed and Easing

```css
--transition-fast: 0.15s ease - Hover states, subtle interactions
--transition-base: 0.2s ease - Button clicks, modal opens
--transition-slow: 0.3s ease - Page transitions, large animations
```

**Rule:** Faster is better. Power users hate waiting for animations.

### What to Animate

**Yes:**
- Hover states (border color, background)
- Focus rings (instant appearance)
- Button lifts (transform: translateY)
- Opacity for show/hide

**No:**
- Page transitions (instant)
- Text appearance (instant)
- Layout shifts (jarring)

**Why:** Animations should provide feedback, not slow the user down.

---

## 13. Data Visualization Principles

### Chart Color Palette

```css
Primary Series: Signal Amber (#F6C667)
Secondary Series: Deep Teal (#2c4b42)
Tertiary Series: Desert Sand (#ba9a5d)
Quaternary Series: Burnt Sienna (#7d3c14)
Fifth Series: Electric Gray (#C1C1C1)
```

**Principles:**
- High contrast against dark background
- Colorblind-safe palette
- Semantic ordering (amber = most important)

### Chart Typography

- Axis labels: 13px, UPPERCASE, wide letter-spacing
- Data labels: 14px, Semibold, monospace for numbers
- Legend: 14px, IBM Plex Sans

---

## 14. Responsive Behavior

### Breakpoints

```css
Mobile: < 768px (single column, stacked panels)
Tablet: 768px - 1024px (2-column grid)
Desktop: 1024px - 1440px (3-column grid, command panels)
Large: > 1440px (4-column grid, max-width: 1600px)
```

### Mobile Adaptations

- Command panels become full-width accordions
- Tables scroll horizontally or transform to cards
- Touch targets minimum 44x44px
- Hover states disabled (use :active instead)

**Principle:** Power users often work on large displays, but mobile should be functional for on-the-go reviews.

---

## 15. Dark Theme Optimization

### Why Dark Theme by Default

1. **Reduce Eye Strain** - RevOps users spend hours in dashboards
2. **Data Focus** - Dark backgrounds make bright data points pop
3. **Professional Aesthetic** - Conveys seriousness and authority
4. **Battery Efficiency** - Saves power on OLED screens

### Dark Theme Color Strategy

- **Background Layers:**
  - Base: #0D0D0D (Jet Black)
  - Surface: #1a1a1f (Slight lift)
  - Elevated: #24242a (Modals, dropdowns)

- **Text Layers:**
  - Primary: #e8e8f0 (High contrast)
  - Muted: #C1C1C1 (Secondary info)
  - Subtle: #8a8a95 (Tertiary, placeholders)

**Why:** 3-level background system + 3-level text system provides sufficient contrast without overwhelming the eye.

---

## 16. Component Usage Examples

### Primary CTA Button

```html
<button class="btn btn-primary">
  Enforce Pipeline Discipline →
</button>
```

**Visual Outcome:**
- Signal Amber background (#F6C667)
- Black text (high contrast: 8.2:1)
- Bold weight (700)
- Lifts 2px on hover with amber glow
- Presses down on click

---

### Data Table with Status

```html
<table class="table">
  <thead>
    <tr>
      <th>DEAL NAME</th>
      <th>HEALTH SCORE</th>
      <th>STATUS</th>
    </tr>
  </thead>
  <tbody>
    <tr class="interactive">
      <td>Enterprise License - Acme Corp</td>
      <td>
        <div class="metric-value" style="font-size: 18px;">34%</div>
      </td>
      <td>
        <span class="status-pill status-pill-danger">ZOMBIE</span>
      </td>
    </tr>
  </tbody>
</table>
```

---

### Metric Dashboard Card

```html
<div class="card">
  <div class="metric">
    <div class="metric-label">REVENUE AT RISK</div>
    <div class="metric-value">$847K</div>
    <div class="metric-delta metric-delta-negative">↓ 12.4%</div>
  </div>
</div>
```

---

### Command Panel Sidebar

```html
<div class="grid-command">
  <aside>
    <div class="command-panel">
      <div class="command-panel-header">FILTERS</div>
      <div class="command-panel-body">
        <!-- Filter controls -->
      </div>
    </div>
  </aside>
  <main>
    <!-- Main content -->
  </main>
</div>
```

---

## 17. Design Checklist

Use this checklist when creating new UI components:

### Visual Design
- [ ] Typography hierarchy is clear (larger = more important)
- [ ] Letter-spacing is appropriate (tight for headings, wide for labels)
- [ ] Colors use semantic tokens (no hardcoded hex values)
- [ ] Spacing uses scale tokens (no arbitrary pixel values)

### Interaction Design
- [ ] All interactive elements have visible hover states
- [ ] Focus states are clearly visible (4px amber ring)
- [ ] Buttons have active states (press down effect)
- [ ] Loading states are indicated (spinner or skeleton)

### Keyboard Navigation
- [ ] Tab order follows visual hierarchy
- [ ] All actions accessible via keyboard
- [ ] Focus ring is visible and high contrast
- [ ] Modal/overlay traps focus until dismissed

### Accessibility
- [ ] Contrast ratios meet WCAG 2.1 AA (4.5:1 minimum)
- [ ] Touch targets are at least 44x44px
- [ ] ARIA labels added for icon-only buttons
- [ ] Semantic HTML elements used correctly

### Functional Density
- [ ] No wasted whitespace (use spacing scale purposefully)
- [ ] Information hierarchy is scannable at a glance
- [ ] Tables use compact 14px text
- [ ] Metric displays use large, bold numbers

---

## 18. Anti-Patterns to Avoid

### Visual
- ❌ Soft, rounded corners everywhere (use sharp 8-12px radius)
- ❌ Gradients and decorative elements (function over form)
- ❌ Low contrast text (#888 on dark gray)
- ❌ Thin fonts below 14px

### Interaction
- ❌ Slow animations (>300ms)
- ❌ Invisible focus states
- ❌ Hover-only actions (support keyboard)
- ❌ Disabled buttons without explanation

### Layout
- ❌ Excessive whitespace (wastes screen real estate)
- ❌ Inconsistent spacing (breaks visual rhythm)
- ❌ Auto-scrolling or animated page transitions
- ❌ Modal overlays without backdrop

---

## 19. Future Enhancements

### Planned Features
- [ ] Command palette (⌘+K) for power users
- [ ] Customizable keyboard shortcuts
- [ ] Dark/light theme toggle (dark by default)
- [ ] Compact/comfortable density modes
- [ ] Drag-and-drop table reordering
- [ ] Inline editing for data cells

---

## References

### Design Principles Sources
- [Microsoft Power Platform Design Standards](https://learn.microsoft.com/en-us/power-platform/well-architected/experience-optimization/design-standards)
- [Nielsen Norman Group - 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Figma UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)

### Internal Documentation
- [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) - Core design philosophy
- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) - Complete token reference
- [Brand_Guidelines.md](./obsidian-business-docs/Brand_Guidelines.md) - Brand colors and typography

---

*Last Updated: 2025-10-24*
*This document evolves as we refine the command-and-control aesthetic.*
