# DesignPick

A Manifest V3 Chrome extension that extracts design tokens from any webpage — CSS variables, colors, fonts, border radii, and box shadows — and exports them as CSS Variables, JSON, or Figma Tokens JSON.

---

## Features

- **CSS Custom Properties** — reads every `--variable` declaration from all accessible stylesheets
- **Colors** — scrapes `color`, `background-color`, `border-color`, `fill`, and `stroke` from up to 600 DOM elements; deduplicates, converts to hex, and sorts by hue
- **Typography** — unique font families (excluding generic keywords) and all font sizes used on the page
- **Border Radii & Box Shadows** — every unique `border-radius` and `box-shadow` value
- **Three export formats** — CSS Variables (`:root { … }`), JSON, and Figma Tokens JSON (`{ value, type }`)
- **One-click copy** — click any token swatch or row to copy its value; copy an entire section with **copy all**; copy or download the full export

---

## Installation

### Chrome Web Store

> Coming soon — submission in progress.

### Load unpacked (developer mode)

1. Clone the repo and build:
   ```bash
   git clone https://github.com/santoshP0/designpick.git
   cd designpick
   npm install
   npm run build
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the `dist/` folder
5. Pin the extension from the Chrome toolbar and navigate to any webpage

---

## Development

```bash
npm install        # install dependencies
npm run build      # production build → dist/  (runs icon generator first)
npm run dev        # Vite dev server for UI iteration
```

The `prebuild` step (`scripts/generate-icons.mjs`) auto-generates `public/icons/icon{16,48,128}.png` using only Node.js built-ins — no extra dependencies required.

After every change to source files, run `npm run build` and click the **reload** button on `chrome://extensions`.

---

## How It Works

1. User clicks the extension icon → popup opens
2. Clicking **Extract Tokens** calls `chrome.scripting.executeScript` to inject a self-contained function into the active tab
3. The injected function reads CSS custom properties from all same-origin stylesheets and walks up to 600 DOM elements collecting computed color, typography, radius, and shadow values
4. Results are returned to the popup, displayed in collapsible sections, and can be exported in three formats

No content scripts are permanently injected. The extension only touches a page when the user explicitly clicks **Extract Tokens**.

---

## Project Structure

```
designpick/
├── popup.html                      # Vite HTML entry point
├── vite.config.js
├── package.json
├── public/
│   ├── manifest.json               # Chrome MV3 manifest
│   └── icons/                      # PNG icons, generated at build time
├── scripts/
│   └── generate-icons.mjs          # Icon generator (pure Node.js, no extra deps)
└── src/
    ├── extractor.js                 # Self-contained function injected via executeScript
    ├── main.jsx                     # React entry
    ├── App.jsx / App.css            # Popup shell + styles
    └── components/
        ├── TokenSection.jsx         # Collapsible token group with copy-all
        └── ExportPanel.jsx          # Format tabs + copy / download
```

---

## Export Formats

### CSS Variables

```css
:root {
  --color-primary: #6c63ff;
  --spacing-md: 16px;
  --font-family-1: "Inter";
  --font-size-1: 14px;
  --radius-1: 8px;
  --shadow-1: 0 2px 8px rgba(0,0,0,0.12);
}
```

### JSON

```json
{
  "cssVariables": { "--color-primary": "#6c63ff" },
  "colors": ["#6c63ff", "#1a1a2e"],
  "typography": {
    "fontFamilies": ["Inter", "Fira Code"],
    "fontSizes": ["12px", "14px", "16px", "24px"]
  },
  "radii": ["4px", "8px", "50%"],
  "shadows": ["0 2px 8px rgba(0,0,0,0.12)"]
}
```

### Figma Tokens JSON

```json
{
  "colors": {
    "color-1": { "value": "#6c63ff", "type": "color" }
  },
  "typography": {
    "fontFamily-1": { "value": "Inter", "type": "fontFamilies" },
    "fontSize-1":   { "value": "14px", "type": "fontSizes" }
  },
  "borderRadius": {
    "radius-1": { "value": "8px", "type": "borderRadius" }
  },
  "effects": {
    "shadow-1": { "value": "0 2px 8px rgba(0,0,0,0.12)", "type": "boxShadow" }
  }
}
```

---

## Permissions

| Permission   | Why it's needed |
|--------------|-----------------|
| `activeTab`  | Grants temporary access to the current tab when the user clicks the extension icon |
| `scripting`  | Allows injecting the extraction function into the active tab on demand |

DesignPick does **not** request `tabs`, `history`, `cookies`, or any host permissions.

---

## Privacy

DesignPick runs entirely in your browser. It does **not** collect, transmit, or store any data. All extraction happens locally; nothing leaves your machine. The extension only activates when you explicitly click **Extract Tokens** on a page.

---

## Contributing

1. Fork the repo and create a feature branch
2. `npm install && npm run build` to verify the build
3. Open a pull request with a clear description of the change

---

## License

MIT — see [LICENSE](LICENSE).
