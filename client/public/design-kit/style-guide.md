# Pastel SaaS Style Guide

## Visual direction
- Tone: calm, productivity-focused, clean, with soft blue-purple accents.
- Surfaces: light glass cards over subtle gradient backgrounds.
- Elevation: low to medium depth, never heavy or muddy.

## Color palette (accessible-first)
- Light background: #F7F9FF
- Soft gradient start/end: #F8FAFF -> #EEF2FF
- Surface card: rgba(255, 255, 255, 0.78)
- Border: #DBE4FF
- Text primary: #111827
- Text secondary: #475569
- Muted text: #64748B
- Primary action: #4F46E5
- Primary hover: #4338CA
- Accent violet: #8B5CF6
- Accent blue: #60A5FA
- Success bg/text: #DCFCE7 / #166534
- Warning bg/text: #FEF3C7 / #92400E
- Danger bg/text: #FEE2E2 / #991B1B

Contrast notes
- Body text on light surface (#111827 on #FFFFFF) meets AAA.
- Secondary text (#475569) on #FFFFFF is AA for body sizes.
- Badge text colors selected for AA+ contrast over badge backgrounds.

## Typography
- Primary font: Inter, Segoe UI, system-ui, sans-serif
- Optional display pair: Inter + Manrope
- Base sizes:
  - H1: 28/34, weight 700
  - H2: 22/30, weight 700
  - H3: 18/26, weight 600
  - Body: 14/22, weight 400-500
  - Label: 12/18, weight 600

## Spacing scale
- 4, 8, 12, 16, 20, 24, 32
- Card padding: 16-20
- Grid gap: 12-16
- Border radius: 10-16

## Component guidance
- Buttons
  - Primary: blue-violet gradient, 44px min height, medium shadow on hover.
  - Secondary: white surface with soft border.
- Inputs
  - Neutral border + stronger focus ring in violet tint.
- Cards
  - Glass surface + subtle border + soft shadow.
- Navigation
  - Active tab uses primary fill with white text.
- Data badges
  - Use semantic bg/text pairs (success, warning, danger, info).

## 3D-like effect guidance (subtle only)
- Use one shadow stack max:
  - y-offset 8-18, blur 18-42, opacity 0.10-0.20
- Add tiny top border highlight or low-opacity stroke.
- Prefer hover lift of 1-2px only.
- Avoid deep dark shadows on pastel backgrounds.

## Asset checklist and naming
- Icons: 16, 20, 24 px outlined, stroke 1.5-1.75.
- Logos: SVG only.
- Export naming:
  - icon-<name>-<size>.svg
  - logo-<brand>-primary.svg
  - mockup-<theme>-<screen>.svg

## Mockups in this folder
- mockup-light-dashboard.svg
- mockup-dark-dashboard.svg
- mockup-accent-heavy.svg
- mockup-auth-light.svg
- mockup-components-grid.svg
