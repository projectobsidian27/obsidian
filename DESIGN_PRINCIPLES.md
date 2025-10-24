# Obsidian - Design Principles

## Core Philosophy
**Discipline > Hustle | Outcome > Noise | Signal > Vanity**

---

## 1. User-Centric and Intuitive Design

### Match the Real World
- **RevOps Language**: Use terminology familiar to revenue operations teams
  - "Pipeline Health" not "System Score"
  - "Zombie Deals" not "Inactive Records"
  - "Revenue at Risk" not "Potential Loss"
- **Familiar Icons**: Use universally recognized symbols
  - ⚡ for quick actions
  - 🎯 for goals/targets
  - 📊 for reports
- **Real-world Metaphors**: "Vanguard" (scout), "Command" (enforce), "Scribe" (narrative)

### Clarity Over Complexity
- **Minimalistic Approach**: Every element has a clear purpose
  - Landing page focuses on single CTA: "Get Started Free"
  - Dashboard shows 4 key metrics (not 20)
  - Explainable signals with click-to-reveal calculations
- **Content-First**: Data and insights take priority over decoration
- **Progressive Disclosure**: Show details only when needed (e.g., signal calculations on click)

### User Control and Freedom
- **Easy Undo**: All enforcement actions can be reviewed before execution
- **Free Navigation**: Users can jump between report sections without losing context
- **Back Buttons**: Every onboarding step has a "← Go Back" option
- **Export Options**: Users own their data - can export reports anytime

### User Research
- **RevOps Personas**: Sales Ops, Revenue Ops, Sales Leadership
- **User Goals**:
  - Find stalled deals quickly
  - Understand WHY deals are stalled (not just THAT they're stalled)
  - Take action without leaving their CRM
- **User Frustrations**:
  - Black box AI recommendations
  - Too many vanity metrics
  - Reports that don't lead to action

---

## 2. Consistency and Standardization

### Visual Consistency
**Color Palette** (Brand Guidelines):
- **Primary**: Signal Amber (#F6C667) - CTAs, highlights
- **Neutrals**: Jet Black (#0D0D0D), Graphite (#3B3B3B), Electric Gray (#C1C1C1)
- **Accents**: Deep Teal (#2c4b42), Burnt Sienna (#7d3c14), Crimson Alert (#ec1b31)
- **Usage**: Consistent across all components - buttons, badges, charts

**Typography**:
- **Headings**: Inter Bold (weights: 600, 700, 800)
- **Body**: IBM Plex Sans (weights: 300, 400, 500, 600)
- **Hierarchy**: Clear distinction between H1 (36px), H2 (24px), H3 (18px), Body (14-16px)

**Component Styles**:
- `.card` - Consistent padding, border-radius, shadow across all pages
- `.btn-primary` - Always Signal Amber, same hover states
- `.badge` - Uniform sizing and spacing
- **Icons**: Same size and visual weight throughout

### Functional Consistency
- **Navigation Patterns**: Same navigation structure on every page
- **Form Behaviors**: All inputs validate on blur, show errors consistently
- **Interactions**:
  - Hover states always trigger at same speed (0.2s transition)
  - Click feedback always immediate
  - Loading states always show progress

### Standard Patterns
- **Navigation**: Top navigation bar with consistent placement
- **Forms**: Labels above inputs, validation below
- **Modals**: Centered, darkened overlay, close button top-right
- **Cards**: Consistent structure - icon/title/description/action
- **Tables**: Sortable columns, hover highlights, consistent row heights

### Platform Guidelines
- **Web Standards**: Follow W3C accessibility guidelines
- **Responsive Design**: Mobile-first approach, breakpoints at 768px, 1024px, 1440px
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

---

## 3. Usability and Accessibility

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast**:
  - Text on dark backgrounds: minimum 4.5:1 ratio
  - Signal Amber (#F6C667) on Jet Black (#0D0D0D): 8.2:1 ✅
- **Typography**:
  - Minimum font size: 14px for body text
  - Line height: 1.5-1.8 for readability
  - IBM Plex Sans chosen for clarity and legibility
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Keyboard Navigation**: All actions accessible via keyboard
- **Screen Readers**: Semantic HTML, ARIA labels where needed
- **Focus States**: Clear visual indicators for focused elements

### Provide Feedback
- **Immediate Feedback**: Every action gets instant visual response
  - Button click: Visual state change + loading spinner
  - Form submission: Loading state → Success/error message
  - Data save: "Saved" indicator with timestamp
- **Progress Indicators**:
  - Scanning: Animated progress bar with step descriptions
  - Loading: Skeleton loaders (not blank screens)
  - Percentage: Exact progress numbers (not just spinners)
- **Error Messages**: Clear, actionable, human-friendly
  - ❌ "Error 500"
  - ✅ "Couldn't connect to HubSpot. Please try again or contact support."

### Affordance
- **Buttons Look Clickable**:
  - Raised appearance (subtle shadow)
  - Hover states that "lift" on interaction
  - Cursor changes to pointer
- **Links Underlined**: Primary links underlined on hover
- **Inputs Have Borders**: Clear visual boundary for form fields
- **Disabled States**: Reduced opacity + cursor: not-allowed
- **Interactive Elements**: Visual cues (icons, arrows) that suggest action

---

## 4. Modern Architectural and Layout Standards

### Layered Architecture
**Frontend** (Next.js):
```
┌─────────────────────────────────────┐
│  UI Layer (pages/)                  │
│  - index.tsx, dashboard/report.tsx  │
├─────────────────────────────────────┤
│  State Management (Zustand)         │
│  - User session, CRM connection     │
├─────────────────────────────────────┤
│  API Layer (API calls to backend)   │
│  - fetch(), axios interceptors      │
└─────────────────────────────────────┘
```

**Backend** (FastAPI):
```
┌─────────────────────────────────────┐
│  API Layer (routers/)               │
│  - auth.py, scan.py, enforce.py     │
├─────────────────────────────────────┤
│  Business Logic (services/)         │
│  - Vanguard scanner, signal calcs   │
├─────────────────────────────────────┤
│  Data Layer (database, cache)       │
│  - PostgreSQL, Redis                │
└─────────────────────────────────────┘
```

**Unidirectional Data Flow (UDF)**:
1. User interacts with UI
2. Action dispatched to state management
3. State updated via reducer/function
4. UI re-renders with new state

### Responsive Containers
- **CSS Grid**: For main layouts (dashboard cards, report sections)
- **Flexbox**: For component-level layouts (button groups, form rows)
- **Container Queries**: Adapt to parent container size (future enhancement)
- **Breakpoints**:
  ```css
  /* Mobile-first approach */
  .card { /* Base styles for mobile */ }

  @media (min-width: 768px) { /* Tablet */ }
  @media (min-width: 1024px) { /* Desktop */ }
  @media (min-width: 1440px) { /* Large desktop */ }
  ```

### Don't Repeat Yourself (DRY)
**Component Reusability**:
- **Button Component**: Single source of truth for all buttons
  ```tsx
  <Button variant="primary" size="large" onClick={handleClick}>
    Get Started Free →
  </Button>
  ```
- **Card Component**: Reused across dashboard, onboarding, reports
- **Badge Component**: Status indicators with consistent styling
- **Form Components**: Input, Select, Checkbox with built-in validation

**Utility Functions**:
- `formatCurrency()` - Used everywhere money is displayed
- `calculateHealth()` - Centralized signal calculation logic
- `formatDate()` - Consistent date formatting

**Style Variables**:
```css
:root {
  --color-jet-black: #0D0D0D;
  --color-signal-amber: #F6C667;
  --font-heading: 'Inter', sans-serif;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

### Use Typography to Communicate
**Visual Hierarchy**:
1. **H1 (36px, Inter Bold)**: Page titles - "Running Diagnostic Scan"
2. **H2 (24px, Inter Bold)**: Section headers - "Pipeline Health: 68%"
3. **H3 (18px, Inter Semibold)**: Card titles - "Revenue at Risk"
4. **Body (16px, IBM Plex Sans)**: Main content, descriptions
5. **Small (14px, IBM Plex Sans)**: Labels, metadata, timestamps
6. **Caption (13px, IBM Plex Sans)**: Helper text, disclaimers

**Emphasis Through Typography**:
- **Bold**: Key metrics, important numbers
- **Color**: Status indicators (green = good, amber = warning, red = critical)
- **Size**: Hierarchy without overuse of different font families
- **Weight Variation**: IBM Plex Sans (300-700) for subtle emphasis

**Typographic Rhythm**:
- Consistent line-height (1.6 for body, 1.2 for headings)
- Generous whitespace between sections
- Paragraph spacing: 16px bottom margin
- Letter-spacing: Subtle adjustments for readability

---

## Implementation Checklist

### Current Status ✅
- [x] Brand color palette implemented in globals.css
- [x] Typography (Inter + IBM Plex Sans) loaded via Google Fonts
- [x] Card component pattern established
- [x] Button styles with hover states
- [x] Responsive layout (container max-width)
- [x] Dark theme design system

### Next Steps 🔨
- [ ] Create reusable Button component (replace inline styles)
- [ ] Create reusable Card component
- [ ] Add keyboard navigation support
- [ ] Implement loading states (skeleton screens)
- [ ] Add error boundaries for better error handling
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Add focus indicators for keyboard users
- [ ] Implement responsive breakpoints for mobile/tablet

---

## References
- **Brand Guidelines**: `/obsidian-business-docs/Brand_Guidelines.md`
- **Color Palette**: See Brand Guidelines (Jet Black, Signal Amber, etc.)
- **Typography**: Inter (headings), IBM Plex Sans (body)
- **Accessibility**: [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Last Updated: 2025-10-24*
*These principles guide every design decision in the Obsidian Pipeline Discipline Platform.*
