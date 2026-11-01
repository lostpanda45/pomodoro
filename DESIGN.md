# DESIGN.md - Material Design 3 Focus Timer

## Colour Roles (Token Set)

### Light Theme
| Token | Value (hex) | Role | Usage |
|---|---|---|---|
| `md-sys-color-primary` | `#6750A4` | Primary | Main accent for interactive elements |
| `md-sys-color-on-primary` | `#FFFFFF` | On Primary | Text/icons on primary |
| `md-sys-color-primary-container` | `#EADDFF` | Primary Container | Highlighted surfaces, active states |
| `md-sys-color-on-primary-container` | `#21005D` | On Primary Container | Text/icons on primary container |
| `md-sys-color-surface` | `#FFFBFE` | Surface | Base app background |
| `md-sys-color-surface-container-low` | `#F7F2FA` | Surface Container Low | Cards/elevated surfaces (low elevation) |
| `md-sys-color-surface-container` | `#F3EDF7` | Surface Container | Default cards, panels |
| `md-sys-color-surface-container-high` | `#ECE6F0` | Surface Container High | Prominent cards, modals |
| `md-sys-color-on-surface` | `#1C1B1F` | On Surface | Primary text |
| `md-sys-color-on-surface-variant` | `#49454F` | On Surface Variant | Secondary text, labels |
| `md-sys-color-outline` | `#79747E` | Outline | Borders, dividers |

### Dark Theme
| Token | Value (hex) | Role | Usage |
|---|---|---|---|
| `md-sys-color-primary` | `#D0BCFF` | Primary | Single accent colour |
| `md-sys-color-on-primary` | `#381E72` | On Primary | Text/icons on primary |
| `md-sys-color-primary-container` | `#4F378B` | Primary Container | Highlighted surfaces, active states |
| `md-sys-color-on-primary-container` | `#EADDFF` | On Primary Container | Text/icons on primary container |
| `md-sys-color-surface` | `#1C1B1F` | Surface | Base app background |
| `md-sys-color-surface-container-low` | `#1D1B20` | Surface Container Low | Cards/elevated surfaces (low elevation) |
| `md-sys-color-surface-container` | `#211F26` | Surface Container | Default cards, panels |
| `md-sys-color-surface-container-high` | `#2B2930` | Surface Container High | Prominent cards, modals |
| `md-sys-color-on-surface` | `#E6E1E5` | On Surface | Primary text |
| `md-sys-color-on-surface-variant` | `#CAC4D0` | On Surface Variant | Secondary text, labels |
| `md-sys-color-outline` | `#938F99` | Outline | Borders, dividers |

**Rule:** Only one accent colour used (`primary`). No gradients, glows, or decorative accents.

## Tonal Surface Hierarchy
Surfaces are ordered by elevation/tone, not shadows:
1. `surface` - Base layer (lowest)
2. `surface-container-low` - Slightly elevated content
3. `surface-container` - Default elevated content (cards, timer container)
4. `surface-container-high` - Highest elevation (prominent elements)

No drop shadows. Differentiation via tonal colour variation only.

## M3 Type Scale

### Display/Large (Hero Elements)
| Style | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| `display-large` | 57sp | 400 | 64sp | -0.25px | Large displays |
| `display-medium` | 45sp | 400 | 52sp | 0 | Medium displays |
| `display-small` | 36sp | 400 | 44sp | 0 | Small displays |
| **Timer Numeral (Hero)** | **96-120sp** | **400** | **1.0** | **-0.5px to -1px** | **Primary countdown display** - `tabular-nums`, `font-variant-numeric: tabular-nums` |

### Label/Small
| Style | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| `label-large` | 14sp | 500 | 20sp | 0.1px | Buttons, prominent labels |
| `label-medium` | 12sp | 500 | 16sp | 0.5px | Chips, secondary buttons |
| `label-small` | 11sp | 500 | 16sp | 0.5px | Captions, metadata |

**Type family:** Roboto (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)

## 8dp Spacing Scale
| Token | Value | Usage |
|---|---|---|
| `space-1` | 8dp | Tight gaps, icon padding |
| `space-2` | 16dp | Default element spacing |
| `space-3` | 24dp | Section spacing |
| `space-4`token的 32dp | 32dp | Large section gaps |
| `space-5` | 40dp | Major sections |
| `space-6` | 48dp | Extra large spacing |
| `space-7` | 56dp | Touch target minimum reference |
| `space-8` | 64dp | Major layout spacing |

All spacing follows multiples of 8dp. Minimum touch target: 48dp.

## Corner Radii
| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 4dp | Small elements, text fields |
| `radius-sm` | 8dp | Chips, compact elements |
| `radius-md` | 12dp | Cards, buttons (default) |
| `radius-lg` | 16dp | Prominent cards, containers |
| `radius-xl` | 28dp | Large surfaces, hero elements |

## Motion Durations
| Token | Value | Usage |
|---|---|---|
| `motion-duration-short1` | 50ms | Micro-interactions |
| `motion-duration-short2` | 100ms | Small transitions |
| `motion-duration-short3` | 150ms | Press states |
| `motion-duration-short4` | 200ms | Default transitions |
| `motion-duration-medium1` | 250ms | Standard motion (M3 recommended) |
| `motion-duration-medium2` | 300ms | Emphasized transitions |
| `motion-duration-medium3` | 350ms | Larger transitions |
| `motion-duration-medium4` | 400ms | Complex transitions |
| `motion-duration-long1` | 450ms | Page transitions |
| `motion-duration-long2` | 500ms | Emphasized long transitions |
| `motion-duration-long3` | 550ms | Hero transitions |
| `motion-duration-long4` | 600ms | Complex long transitions |

**Easing:** `cubic-bezier(0.2, 0, 0, 1)` (M3 standard easing) for emphasized motion, `cubic-bezier(0.4, 0, 0.2, 1)` for standard motion. Respect `prefers-reduced-motion`.
