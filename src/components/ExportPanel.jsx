import { useState } from 'react';

const FORMATS = [
  { id: 'css', label: 'CSS Vars' },
  { id: 'json', label: 'JSON' },
  { id: 'figma', label: 'Figma Tokens' },
];

function toCSS(tokens) {
  const lines = [];
  Object.entries(tokens.cssVariables).forEach(([k, v]) => lines.push(`  ${k}: ${v};`));
  tokens.colors.forEach((c, i) => lines.push(`  --color-${i + 1}: ${c};`));
  tokens.typography.fontFamilies.forEach((f, i) =>
    lines.push(`  --font-family-${i + 1}: ${JSON.stringify(f)};`)
  );
  tokens.typography.fontSizes.forEach((s, i) => lines.push(`  --font-size-${i + 1}: ${s};`));
  tokens.radii.forEach((r, i) => lines.push(`  --radius-${i + 1}: ${r};`));
  tokens.shadows.forEach((s, i) => lines.push(`  --shadow-${i + 1}: ${s};`));
  return `:root {\n${lines.join('\n')}\n}`;
}

function toJSON(tokens) {
  const { meta, ...rest } = tokens;
  return JSON.stringify(rest, null, 2);
}

function toFigma(tokens) {
  const out = {};
  if (tokens.colors.length) {
    out.colors = Object.fromEntries(
      tokens.colors.map((c, i) => [`color-${i + 1}`, { value: c, type: 'color' }])
    );
  }
  const typo = {};
  tokens.typography.fontFamilies.forEach((f, i) => {
    typo[`fontFamily-${i + 1}`] = { value: f, type: 'fontFamilies' };
  });
  tokens.typography.fontSizes.forEach((s, i) => {
    typo[`fontSize-${i + 1}`] = { value: s, type: 'fontSizes' };
  });
  if (Object.keys(typo).length) out.typography = typo;
  if (tokens.radii.length) {
    out.borderRadius = Object.fromEntries(
      tokens.radii.map((r, i) => [`radius-${i + 1}`, { value: r, type: 'borderRadius' }])
    );
  }
  if (tokens.shadows.length) {
    out.effects = Object.fromEntries(
      tokens.shadows.map((s, i) => [`shadow-${i + 1}`, { value: s, type: 'boxShadow' }])
    );
  }
  if (Object.keys(tokens.cssVariables).length) {
    out.cssVariables = Object.fromEntries(
      Object.entries(tokens.cssVariables).map(([k, v]) => [
        k.replace(/^--/, ''),
        { value: v, type: 'other' },
      ])
    );
  }
  return JSON.stringify(out, null, 2);
}

export default function ExportPanel({ tokens }) {
  const [format, setFormat] = useState('css');
  const [copied, setCopied] = useState(false);

  function content() {
    if (format === 'css') return toCSS(tokens);
    if (format === 'json') return toJSON(tokens);
    return toFigma(tokens);
  }

  function handleCopy() {
    navigator.clipboard.writeText(content());
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function handleDownload() {
    const ext = format === 'css' ? 'css' : 'json';
    const host = tokens.meta?.hostname;
    const filename = host ? `${host}-design-tokens.${ext}` : `design-tokens.${ext}`;
    const blob = new Blob([content()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: filename }).click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="export-panel">
      <div className="export-tabs">
        {FORMATS.map(f => (
          <button
            key={f.id}
            className={`export-tab${format === f.id ? ' active' : ''}`}
            onClick={() => setFormat(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <pre className="export-preview">{content()}</pre>
      <div className="export-actions">
        <button className="export-btn copy" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <button className="export-btn download" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}
