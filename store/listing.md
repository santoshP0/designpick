# Chrome Web Store — Listing Copy

Paste this content into the Chrome Web Store Developer Dashboard.

---

## Extension Name

```
DesignPick
```

---

## Short Description

*(128 characters max — current: 124)*

```
Extract design tokens from any webpage — colors, fonts, CSS variables, radii & shadows. Export as CSS, JSON or Figma Tokens.
```

---

## Detailed Description

```
DesignPick is a developer and designer tool that extracts design tokens from any webpage in one click.

HOW IT WORKS
Click the DesignPick icon on any webpage to pull its design tokens — no setup, no account, no API keys required. Works on any site.

WHAT IT EXTRACTS
• CSS Custom Properties — every --variable declaration from all accessible stylesheets
• Colors — background, text, border, fill, and stroke values; deduped, converted to hex, and sorted by hue
• Font Families — unique typefaces used on the page (generic keywords like sans-serif filtered out)
• Font Sizes — all unique font sizes in use, sorted smallest to largest
• Border Radii — every unique border-radius value
• Box Shadows — every unique box-shadow value

EXPORT FORMATS
• CSS Variables  →  :root { --color-1: #6c63ff; … }
• JSON           →  structured token object
• Figma Tokens   →  { value, type } format compatible with the Figma Tokens plugin

FEATURES
• Click any token to copy its value to clipboard
• "Copy all" button on every section
• Copy or download the full export in your chosen format
• Downloaded files are named after the page domain (e.g. stripe.com-design-tokens.css)
• Shows the page hostname and total token count after extraction
• Works entirely offline — no network requests, ever

PRIVACY
DesignPick collects zero data. Everything runs locally in your browser. See the full privacy policy linked below.
```

---

## Category

**Developer Tools**

---

## Language

English

---

## Keywords / Tags

```
design tokens, CSS variables, color picker, font extractor, Figma, design system, developer tools, CSS, web design
```

---

## Privacy Policy URL

Host `PRIVACY.md` (or its content) at a public URL and paste it here.

Recommended options:
- GitHub Pages: `https://santoshP0.github.io/designpick/privacy`
- Raw GitHub: `https://raw.githubusercontent.com/santoshP0/designpick/main/PRIVACY.md`

> **Note:** The Chrome Web Store requires a privacy policy URL even for extensions that collect no data.

---

## Screenshots Required

Minimum 1, maximum 5. Size: **1280×800** or **640×400** pixels (PNG or JPEG).

Suggested screenshots:
1. Popup open on a design-heavy site (e.g. stripe.com) showing Colors + CSS Variables sections
2. Typography + Border Radii sections expanded
3. Export panel open on the CSS Variables tab
4. Export panel showing Figma Tokens JSON format
5. Empty state with the "Extract Tokens" button visible

**To capture:**
1. `npm run build` → load `dist/` as an unpacked extension in Chrome
2. Navigate to a design-rich webpage (stripe.com, linear.app, etc.)
3. Click the DesignPick icon → click **Extract Tokens**
4. Open Chrome DevTools → toggle device toolbar → set to 380×580
5. Right-click the popup → Inspect, screenshot via DevTools, or use a screen capture tool
6. Crop/resize to 1280×800

---

## Promotional Images (optional but recommended)

- Small promo tile: **440×280** px
- Large promo tile: **920×680** px

Use the brand color `#6c63ff` as the background with the extension UI or icon centered.
