# Ophelia's Tears Studio — Canonical Figma Specification

**Source:** File key `NwPniXXdjTvxpdZZYKUtwl`, page `96:244` ("BREAKPOINTS")  
**Last Updated:** Phase 1 extraction, confirmed against `get_design_context` output and screenshots

---

## S Breakpoint (375–719px) — Mobile

### Homepage (Frame `96:499`, width 375)

**Header Layout:**
- No logo visible
- Menu toggle button (hamburger, 24px × 24px) positioned top-left at coordinates (24px, 38px)
- Book Now CTA positioned top-right at coordinates (calc(50%+41.5px), 24px)
  - Width: 114px (inner button), 122px (outer with background)
  - Height: 40px (inner), 48px (outer)
  - Background: #224b60
  - Text: "Book Now" 16px, white, with arrow icon (7.616px × 7.626px)

**Hero Image (DESKTOP-HERO-IMG):**
- Width: 326px
- Height: 402.539px (container); 386.868px (masked content)
- Positioned center (left: calc(50%+0.5px), top: 160.267px)
- Uses mask + cover image pair from Figma assets
- Ripple effect applied to `.studio-name-img` (matches current codebase selector)

**Background (DESKTOP-BG):**
- Width: 540px
- Height: 176.057px
- Positioned left: -83px, top: 264.53px (extends beyond viewport for center reveal)
- SVG illustration asset

**Footer (HOME-INFO):**
- Positioned bottom: 24px (actual), but with mobile CTA at bottom: 0 taking 80px, so footer is bottom: 104px
- Max-width: 326px
- **Order (vertical stack, centered):**
  1. Mobile logo: 326px × 42px
  2. Address: "12 PARK ST, BROOKLYN, NY" (10px, uppercase, centered)
  3. Appointment: "BY APPOINTMENT ONLY" (10px, uppercase, centered)
  4. Icon flower: 25.645px × 15.806px (centered)
  5. Copyright: "©2026 OPHELIA'S TEARS STUDIO" (10px, uppercase, centered)
- Gap between elements: 8px
- All text: Minion Pro, letter-spacing: 0.25em (4px)

**Mobile CTA Container:**
- Position: fixed bottom: 0, height: 80px
- Background: white
- Centered Book Now button (width: 114px max, derived from 100% - 62px margin constraints)

---

### Mobile Menu (Frame `96:529`, width 375)

**Background:**
- Color: #FFFAF3 (cream)

**Header:**
- Close icon (X) positioned top-left (26.81px, 39px)
  - Made from two rotated lines: -45deg and 45deg
  - Each line: 24px × 2px black
- Book Now CTA positioned top-right (230px, 24px)
  - Width: 114px (inner), 122px (outer)
  - Height: 40px (inner), 48px (outer)
  - Same styling as homepage header

**Navigation Links (MOBILE-LINKS):**
- Positioned top: 120px, left: 24px
- Font: 24px, Minion Pro
- All links have dotted underline
- Order:
  1. About (no arrow)
  2. Artists (no arrow)
  3. Browse Flash (with arrow icon 7.616px × 7.626px)
  4. Booking Info (with arrow icon)
  5. Aftercare (with arrow icon in Figma frame, but user requirement says remove arrow — **remove arrow for Aftercare only**)
- Gap between links: 40px (vertical)

**Menu Footer (MENU-FOOTER):**
- Positioned bottom: 652px (relative to 812px frame height = ~48px from bottom)
- Width: 326px, centered
- **Order (vertical stack):**
  1. Mobile logo: 326px × 42px
  2. Address: "12 PARK ST, BROOKLYN, NY" (10px)
  3. Appointment: "BY APPOINTMENT ONLY" (10px)
  4. Icon flower: 26px × 16px (with **color #DCC6A6** per user requirement — apply via CSS filter/colorization)
  5. Copyright: "©2026 OPHELIA'S TEARS STUDIO" (10px)
- Gap: 8px between logo and text block; 16px between address/appointment and icon; 16px between icon and copyright

---

## M Breakpoint (720–1079px) — Tablet

### Homepage (Frame `96:440`, width 720)

**Header Layout:**
- No logo visible
- Menu toggle button positioned top-left (32px, 38px)
- Book Now CTA positioned top-right (calc(75%+26px), 24px)
  - Same dimensions and styling as S

**Hero Image:**
- Width: 310.755px
- Height: 383.715px
- Positioned center, top: 292.14px

**Background (DESKTOP-BG):**
- Width: 656px
- Height: 213.876px
- Positioned left: 32px

**Footer (HOME-INFO):**
- Positioned top: 834px
- Max-width: 518px
- **Layout: Flex column with 16px gap**
- **Order:**
  1. Mobile logo: 464px × 60px (max-width constraint; scales within 326–464px range across S→M)
  2. Footer text block (flex column, gap 8px):
     - Address: "12 PARK ST, BROOKLYN, NY" (10px, centered)
     - Row: Address + Icon (25.645px × 15.806px) + Appointment (10px) (gap: 16px horizontal)
     - Copyright: "©2026 OPHELIA'S TEARS STUDIO" (10px)

---

### Mobile Menu (Frame `96:593`, width 720)

**Background:**
- Color: #FFFAF3

**Header:**
- Close icon (X) positioned top-left (34.81px, 39px)
- Book Now CTA positioned top-right (222px, 24px)

**Navigation Links (MOBILE-LINKS):**
- Font: 32px (larger than S)
- Dotted underline
- Same order and structure as S (About, Artists, Browse Flash, Booking Info, Aftercare without arrow)
- Gap: 48px (vertical)

**Menu Footer:**
- Positioned bottom: 810px
- Logo: 312px × 40px
- Text layout: Address-icon-appointment in one row (gap 16px), copyright below
- Icon: #DCC6A6 color

---

## L Breakpoint (1080px+) — Desktop

### Homepage (Frame `96:326`, width 1080)

**Header Layout:**
- Desktop logo visible (SVG asset) — width: ~226px, height: 29px (from metadata aspect ratio)
- Navigation visible: About, Artists, Browse Flash, Booking Info, Aftercare
  - All 16px font
  - All with dotted underline
  - Gap: 32px between links
  - All links rendered as underlined text (no external link styling with arrows, unlike Browse Flash/Booking Info external links on S/M)
- Book Now CTA positioned top-right
  - Same dimensions and styling as S/M

**Hero Image:**
- Width: 362.929px
- Height: 448.139px

**Background (DESKTOP-BG):**
- Width: 1002px
- Height: 326.683px

**Footer (FOOTER-desktop):**
- Positioned top: 906px (near bottom of 976px frame)
- Max-width: 518px
- **Layout: Flex column, gap 8px**
- **Row 1 (gap 16px horizontal):**
  - Address: "12 PARK ST, BROOKLYN, NY" (12px, centered, uppercase, letter-spacing 0.25em)
  - Icon flower: 25.645px × 15.806px
  - Appointment: "BY APPOINTMENT ONLY" (12px)
- **Row 2:**
  - Copyright: "©2026 OPHELIA'S TEARS STUDIO" (12px, centered, uppercase)

**No separate menu frame on L** — desktop nav is always visible, no hamburger/overlay.

---

## Typography Reference

**Fonts:**
- Body: Minion Pro (all text)
- Size scales:
  - S: footer 10px, menu links 24px, header CTA 16px
  - M: footer 10px, menu links 32px, header CTA 16px
  - L: footer 12px, nav links 16px, header CTA 16px

**Letter Spacing:**
- All text: 0.25em (0.4px for 16px text, etc.)
- Applied via CSS: `letter-spacing: 0.25em`

**Underline Style:**
- Dotted underline on all navigation links (menu and desktop nav)
- CSS: `text-decoration: underline; text-decoration-style: dotted;`

---

## Color Reference

**Background:**
- Homepage/default: #d5f1ff (light blue)
- Menu overlay: #fffaf3 (cream)

**Text:**
- Primary: #000000 (black)
- CTA button text: #ffffff (white)
- CTA button background: #224b60 (dark blue)

**Icons:**
- Flower icon (homepage): #A9CDDE (light blue-gray) — apply via CSS filter
- Flower icon (menu): #DCC6A6 (tan/beige) — apply via CSS filter
- Arrow icons: Original SVG color (typically dark)

---

## Asset Inventory

**Currently referenced (keep):**
- `mobile-logo.svg` — scales 326px (S) → 464px (M), displays in footer
- `desktop-logo.svg` — L breakpoint header only
- `flower-icon.svg` — footer/menu (color-adjusted per state)
- `arrow-icon.svg` — navigation external links (S/M menu, L nav)
- `arrow-icon-white.svg` — Book Now CTA button
- `studio-name-art.png` — S/M ripple texture
- `studio-name-art-mobile.png` — S ripple texture (if separate)
- `cursor.cur` — custom cursor (keep, not in Figma)
- `favicon.png` — site favicon

**Orphaned (remove after rebuild):**
- `header-logo.png` — replaced by desktop-logo.svg
- `flower-icon-menu.svg` — consolidated into flower-icon.svg with CSS colorization
- `studio-name-art-mobile.svg`, `studio-name.svg` — PNG versions used instead
- `hero-img-01.png` — placeholder, replaced by Figma export
- `9c0e76f1...png`, `favicon-2.png` — duplicates

**Hero Image Assets:**
- S: Frame `96:499` exports `image 8` (mask) + `image 9` (cover)
- M: Frame `96:440` exports same pair, scaled
- L: Frame `96:326` exports same pair, scaled
- **Decision:** Use same pair scaled via CSS container size (confirmed: different frame sizes but same asset pair means one responsive export, not three separate files)

---

## Implementation Notes

- **Grid overlay:** Unchanged from current implementation (S: 4-column 24px margins 20px gutters; M: 8-column 32px margins 20px gutters; L: 12-column 40px margins 32px gutters). Always-flexible-columns model preserved per user decision.
- **Ripple effect:** Preserved verbatim from current script.js; no HTML selector changes required if `.studio-name-img` remains.
- **External links:** All venue.ink URLs preserved:
  - Browse Flash: `https://venue.ink/@snakeroots.00/flash`
  - Booking Info: `https://venue.ink/@snakeroots.00/page/info`
  - Aftercare: `https://venue.ink/@snakeroots.00/page/aftercare`
  - Book Now: `https://venue.ink/@snakeroots.00`
- **Custom cursor:** `cursor.cur` not in Figma; keep in CSS as-is.
