---
name: Piedmont
description: Indian Financial Intelligence Terminal
colors:
  primary: "#3b82f6"
  neutral-bg: "#080c14"
  surface-low: "#0f1520"
  border-subtle: "#1c2840"
  border-hover: "#2a3f60"
  text-high: "#f1f5f9"
  text-med: "#cbd5e1"
  text-low: "#64748b"
  positive: "#34d399"
  negative: "#f87171"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    letterSpacing: "0.05em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  card:
    backgroundColor: "{colors.surface-low}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

# Design System: Piedmont

## 1. Overview

**Creative North Star: "The Financial Cockpit"**

Piedmont is designed as a dense, professional intelligence terminal for Indian macroeconomic data. It rejects the generic SaaS look in favor of a high-density, authoritative, and data-forward aesthetic reminiscent of traditional financial terminals (like Bloomberg), but modernized. The UI should be deeply focused, utilizing a dark mode optimized for long-session viewing, with information hierarchy conveyed through subtle typography changes and strict alignment rather than spacious padding. 

Piedmont rejects fluffy, airy whitespace, massive rounded corners, and low-contrast generic elements.

**Key Characteristics:**
- **Data-Dense:** Maximizes screen real estate; compact spacing.
- **Authoritative:** Clean, tabular, unambiguous typography.
- **Surgical Highlights:** Color is reserved almost entirely for status (up/down) and interaction, not decoration.
- **Deep Dark Mode:** Stark contrast against a very dark background to reduce eye strain.

## 2. Colors

The palette is extremely restrained, relying on deep cool-toned neutrals with stark, high-contrast semantic highlights.

### Primary
- **Cockpit Blue** (#3b82f6): Used sparingly for brand presence and active states.

### Semantic
- **Positive Tick** (#34d399): Used strictly for positive market movements and upward trends.
- **Negative Tick** (#f87171): Used strictly for negative market movements and downward trends.

### Neutral
- **Abyss Background** (#080c14): The absolute root background.
- **Surface Low** (#0f1520): The default card and container background.
- **Border Subtle** (#1c2840): Default borders for structure and separation.
- **Text High** (#f1f5f9): Primary data values and critical headers.
- **Text Low** (#64748b): Secondary metadata and context.

### Named Rules
**The Restrained Status Rule.** Color is information, not decoration. Semantic colors (green/red) should only be used to denote directional change or status.

## 3. Typography

**Display Font:** Inter (with system-ui)
**Body Font:** Inter (with system-ui)
**Label/Mono Font:** Inter (tabular-nums enabled)

**Character:** Technical, crisp, and unambiguous. Tabular numbers are mandatory for all data points to ensure vertical alignment.

### Hierarchy
- **Display** (700, 1.5rem): Major metric callouts (e.g., current price).
- **Title** (600, 0.875rem): Card titles and component headers.
- **Body** (400, 0.75rem): Standard text and supporting data.
- **Label** (500, 0.625rem, 0.05em spacing, uppercase): Micro-metadata, ticker symbols, and section headers.

### Named Rules
**The Tabular Data Rule.** All numeric data points (prices, percentages, index values) must use `tabular-nums` so that characters align vertically in lists and grids.

## 4. Elevation

The system is completely flat. There are no drop shadows or ambient glows. Depth is created purely through subtle border contrast and background color shifts (tonal layering).

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Interactive elements only change border color or background lightness on hover.

## 5. Components

### Cards / Containers
- **Corner Style:** 0.5rem (8px)
- **Background:** Surface Low (#0f1520)
- **Shadow Strategy:** Flat (none)
- **Border:** 1px solid Border Subtle (#1c2840)
- **Internal Padding:** Dense (0.75rem to 1.25rem)
- **Hover:** Border shifts to Border Hover (#2a3f60)

### Badges / Tags
- **Style:** Extreme low contrast background (e.g., 10% opacity) with high contrast text.
- **Corner Style:** 0.25rem (4px)

## 6. Do's and Don'ts

### Do:
- **Do** maximize data density. Keep padding tight.
- **Do** align numerical data carefully.
- **Do** use uppercase with wide letter-spacing for micro-labels.

### Don't:
- **Don't** use large rounded corners (anything over 8px).
- **Don't** use generic, airy SaaS whitespace.
- **Don't** use drop shadows. Keep the interface entirely flat.
- **Don't** use bright colored backgrounds for containers; use borders and typography to establish structure.
