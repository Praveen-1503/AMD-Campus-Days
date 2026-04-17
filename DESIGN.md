# Design System Document: Industrial Minimalist AI Stylist

## 1. Overview & Creative North Star: "The Synthetic Atelier"
This design system is built upon the concept of **The Synthetic Atelier**. It merges the raw, structural honesty of industrial design with the fluid, hyper-intelligent precision of artificial intelligence. We are moving away from the "standard retail grid" to create a space that feels like a high-end, darkened boutique where products are illuminated by digital light.

The core aesthetic relies on **Extreme Radius + Tonal Depth**. By pairing aggressive corner rounding (`xl: 3rem`) with a monochromatic charcoal foundation, we create a UI that feels "molded" rather than "assembled." The layout should feel editorial and intentional—utilizing large-scale typography and asymmetrical whitespace to guide the user through a curated styling journey.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones, punctuated by "Electric Blue" triggers.

### The "No-Line" Rule
**Borders are prohibited for structural sectioning.** Boundaries must be defined solely through background color shifts. To separate a product gallery from a navigation rail, shift from `surface` (#0e0e0e) to `surface-container-low` (#131313). This creates a sophisticated, seamless transition that mimics natural light falling on matte surfaces.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials. 
- **Base Level:** `surface` (#0e0e0e)
- **Primary Layout Blocks:** `surface-container` (#1a1919)
- **Elevated Interactive Cards:** `surface-container-high` (#20f19)
- **Floating Modals/Popovers:** `surface-container-highest` (#262626)

### The "Glass & Gradient" Rule
To inject "soul" into the industrial machine:
- **Glassmorphism:** Use `surface_variant` (#262626) at 60% opacity with a `20px` backdrop blur for floating navigation bars or AI suggestion overlays.
- **Signature Textures:** Primary CTAs should not be flat. Apply a subtle linear gradient from `primary_dim` (#3467ff) to `primary` (#94aaff) at a 135-degree angle to simulate the glow of a high-end display.

---

### 3. Typography: High-Contrast Editorial
We pair **Space Grotesk** (Display/Headlines) with **Manrope** (Body/Labels) to balance technical precision with human readability.

*   **Display (Space Grotesk):** Large, airy, and commanding. Use `display-lg` (3.5rem) for hero statements where the AI presents a "Style Verdict."
*   **Headlines (Space Grotesk):** High-contrast white (`on_surface`) against deep backgrounds. 
*   **Body (Manrope):** Optimized for legibility. Use `body-lg` (1rem) for product descriptions.
*   **Labels (Manrope):** Use `label-md` (0.75rem) in `secondary` (#e5e2e1) for technical metadata or "AI Confidence" scores.

---

## 4. Elevation & Depth
In this system, depth is a matter of **Luminance, not Shadow.**

*   **The Layering Principle:** Instead of a drop shadow, place a `surface-container-highest` card inside a `surface` background. The subtle shift from #0e0e0e to #262626 provides all the visual affordance needed.
*   **Ambient Glow:** For the "Electric Blue" primary elements, use a diffused outer glow rather than a black shadow. A shadow of `0px 10px 30px` using `primary` at 15% opacity creates a "neon-on-asphalt" effect.
*   **The "Ghost Border" Fallback:** If a container must be defined against an identical background, use the `outline_variant` (#494847) at **15% opacity**. This creates a "barely-there" structural hint.

---

## 5. Components

### Buttons
*   **Primary:** High-impact. Background: `primary_container` gradient. Corner radius: `full` (9999px) for a "pill" shape or `xl` (3rem). Text: `on_primary_container` (Bold).
*   **Secondary:** Background: `surface_container_highest`. Text: `on_surface`. Focus on the heavy `xl` radius.
*   **Tertiary:** No background. Text: `primary`. Use for low-emphasis actions like "View Details."

### Cards & Lists
*   **Editorial Cards:** Forbid divider lines. Use `lg` (2rem) or `xl` (3rem) radius. Content sections within cards are separated by a shift to `surface_container_lowest` or increased vertical padding (e.g., 48px).
*   **Selection Chips:** For "Style Tags" (e.g., *Avant-Garde*, *Minimalist*), use `surface_container_high` with an `outline` (#777575) at 20% opacity. When selected, transition to `primary` background with `on_primary` text.

### Input Fields
*   **Text Inputs:** Use a "filled" style with `surface_container_highest`. No bottom border. Corner radius: `md` (1.5rem). The cursor/caret must be the `primary` electric blue.
*   **Search/AI Prompt Bar:** A signature component. Use a `full` (9999px) radius and a subtle `primary` glow on focus.

### Special Component: The "Style Gauge"
A custom AI-driven component. A thick, semi-circular progress bar using `surface_container` for the track and `primary` for the progress, indicating how well a garment matches the user’s profile.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Place a large `display-md` headline on the left with a small `body-sm` metadata block offset to the right.
*   **Prioritize Breathing Room:** Use the spacing scale aggressively. Industrial minimalism fails if the UI feels crowded.
*   **Use Heavy Rounding:** Every container must feel soft to the touch, contrasting the "hard" industrial colors.

### Don’t:
*   **No 1px Lines:** Never use `#ffffff` or `#777575` at 100% opacity for a line. Use background tonal shifts.
*   **No "Pure" Grey Shadows:** Avoid standard `rgba(0,0,0,0.5)` shadows. They muddy the deep charcoal palette. If you need a shadow, tint it with the background hue.
*   **No Square Corners:** Standard 4px or 8px radiuses feel "default." Stick to the `DEFAULT` (1rem) as a minimum for small elements, and `xl` (3rem) for layouts.

---

## 7. Roundedness Scale Reference
*   **Small (`sm`):** 0.5rem (Miniature tags/tooltips)
*   **Default:** 1rem (Input fields)
*   **Large (`lg`):** 2rem (Standard cards)
*   **Extra Large (`xl`):** 3rem (Major layout containers/Hero sections)
*   **Full:** 9999px (Buttons/Pill-labels)
