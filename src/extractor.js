// Injected into the page via chrome.scripting.executeScript — must be self-contained.
export function extractDesignTokens() {
  function hexFromColor(color) {
    if (!color || color === 'transparent') return null;
    const m = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
    if (!m) return null;
    if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
    return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  }

  const result = {
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
  const fontFamilySet = new Set();
  const fontSizeSet = new Set();
  const radiiSet = new Set();
  const shadowSet = new Set();

  const elements = Array.from(document.querySelectorAll('body *')).slice(0, 600);
  const colorProps = ['color', 'backgroundColor', 'borderTopColor', 'outlineColor'];

  for (const el of elements) {
    const cs = window.getComputedStyle(el);

    for (const prop of colorProps) {
      const hex = hexFromColor(cs[prop]);
      if (hex) colorSet.add(hex);
    }

    const ff = cs.fontFamily;
    if (ff) fontFamilySet.add(ff.split(',')[0].trim().replace(/['"]/g, ''));

    const fs = cs.fontSize;
    if (fs && fs !== '0px') fontSizeSet.add(fs);

    const br = cs.borderRadius;
    if (br && br !== '0px') radiiSet.add(br);

    const bs = cs.boxShadow;
    if (bs && bs !== 'none') shadowSet.add(bs);
  }

  result.colors = Array.from(colorSet);
  result.typography.fontFamilies = Array.from(fontFamilySet).filter(Boolean);
  result.typography.fontSizes = Array.from(fontSizeSet)
    .sort((a, b) => parseFloat(a) - parseFloat(b));
  result.radii = Array.from(radiiSet).sort();
  result.shadows = Array.from(shadowSet);

  return result;
}
