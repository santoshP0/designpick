// Injected into the page via chrome.scripting.executeScript — must be self-contained.
export function extractDesignTokens() {
  function hexFromColor(color) {
    if (!color || color === 'transparent' || color === 'none') return null;
    const m = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
    if (!m) return null;
    if (m[4] !== undefined && parseFloat(m[4]) === 0) return null; // fully transparent
    return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  }

  // Sort chromatic colors by hue; push desaturated (greys/blacks/whites) to the end.
  function hexToHue(hex) {
    if (!hex || hex.length < 7) return 361;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);
    if (max === 0 || d / max < 0.15) return 361; // desaturated
    let h;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      default: h = ((r - g) / d + 4) * 60;
    }
    return h;
  }

  // Generic CSS font family keywords are not meaningful design tokens.
  const GENERIC_FONTS = new Set([
    'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
    'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace',
    'ui-rounded', 'math', 'emoji', 'fangsong',
  ]);

  const result = {
    meta: { hostname: window.location.hostname },
    cssVariables: {},
    colors: [],
    typography: { fontFamilies: [], fontSizes: [] },
    radii: [],
    shadows: [],
  };

  // CSS custom properties from all accessible stylesheets
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules || [])) {
        if (rule.style) {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith('--')) {
              result.cssVariables[prop] = rule.style.getPropertyValue(prop).trim();
            }
          }
        }
      }
    } catch (_) { /* cross-origin stylesheet — skip */ }
  }

  // Computed styles sampled from up to 600 DOM elements
  const colorSet = new Set();
  const fontFamilyMap = new Map(); // lowercase key → display value (preserves casing)
  const fontSizeSet = new Set();
  const radiiSet = new Set();
  const shadowSet = new Set();

  // Include SVG fill/stroke alongside standard color properties
  const colorProps = ['color', 'backgroundColor', 'borderTopColor', 'outlineColor', 'fill', 'stroke'];
  const elements = Array.from(document.querySelectorAll('body *')).slice(0, 600);

  for (const el of elements) {
    const cs = window.getComputedStyle(el);

    for (const prop of colorProps) {
      const hex = hexFromColor(cs[prop]);
      if (hex) colorSet.add(hex);
    }

    const rawFamily = cs.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
    const lc = rawFamily.toLowerCase();
    if (rawFamily && !GENERIC_FONTS.has(lc) && !fontFamilyMap.has(lc)) {
      fontFamilyMap.set(lc, rawFamily);
    }

    const fs = cs.fontSize;
    if (fs && fs !== '0px') fontSizeSet.add(fs);

    const br = cs.borderRadius;
    if (br && br !== '0px') radiiSet.add(br);

    const bs = cs.boxShadow;
    if (bs && bs !== 'none') shadowSet.add(bs);
  }

  result.colors = Array.from(colorSet)
    .sort((a, b) => hexToHue(a) - hexToHue(b))
    .slice(0, 120);

  result.typography.fontFamilies = Array.from(fontFamilyMap.values()).slice(0, 20);
  result.typography.fontSizes = Array.from(fontSizeSet)
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .slice(0, 40);
  result.radii = Array.from(radiiSet).sort().slice(0, 25);
  result.shadows = Array.from(shadowSet).slice(0, 20);

  return result;
}
