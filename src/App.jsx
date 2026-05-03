import { useState } from 'react';
import { extractDesignTokens } from './extractor.js';
import TokenSection from './components/TokenSection.jsx';
import ExportPanel from './components/ExportPanel.jsx';

export default function App() {
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleExtract() {
    setLoading(true);
    setError(null);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractDesignTokens,
      });
      setTokens(results[0].result);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Cannot access') || msg.includes('chrome://')) {
        setError("Can't access this page. Try a regular website.");
      } else {
        setError(msg || 'Failed to extract tokens.');
      }
    } finally {
      setLoading(false);
    }
  }

  const cssVarCount = tokens ? Object.keys(tokens.cssVariables).length : 0;
  const hasTokens = tokens && (
    cssVarCount > 0 ||
    tokens.colors.length > 0 ||
    tokens.typography.fontFamilies.length > 0 ||
    tokens.typography.fontSizes.length > 0 ||
    tokens.radii.length > 0 ||
    tokens.shadows.length > 0
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-ring" />
        </div>
        <h1>DesignPick</h1>
        <span className="app-tagline">design token extractor</span>
      </header>

      <main className="app-main">
        {!tokens && !loading && !error && (
          <div className="empty-state">
            <p>Open any webpage and click <strong>Extract Tokens</strong> to scrape its design tokens.</p>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {tokens && !hasTokens && (
          <div className="empty-state">
            <p>No design tokens found on this page.</p>
          </div>
        )}

        {tokens && hasTokens && (
          <>
            {cssVarCount > 0 && (
              <TokenSection
                title="CSS Variables"
                items={Object.entries(tokens.cssVariables).map(([k, v]) => ({ label: k, value: v }))}
                type="variable"
              />
            )}
            {tokens.colors.length > 0 && (
              <TokenSection
                title="Colors"
                items={tokens.colors.map(c => ({ label: c, value: c }))}
                type="color"
              />
            )}
            {tokens.typography.fontFamilies.length > 0 && (
              <TokenSection
                title="Font Families"
                items={tokens.typography.fontFamilies.map(f => ({ label: f, value: f }))}
                type="font"
              />
            )}
            {tokens.typography.fontSizes.length > 0 && (
              <TokenSection
                title="Font Sizes"
                items={tokens.typography.fontSizes.map(s => ({ label: s, value: s }))}
                type="size"
              />
            )}
            {tokens.radii.length > 0 && (
              <TokenSection
                title="Border Radii"
                items={tokens.radii.map(r => ({ label: r, value: r }))}
                type="radius"
              />
            )}
            {tokens.shadows.length > 0 && (
              <TokenSection
                title="Box Shadows"
                items={tokens.shadows.map(s => ({ label: s, value: s }))}
                type="shadow"
              />
            )}
            <ExportPanel tokens={tokens} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <button
          className={`extract-btn${loading ? ' loading' : ''}`}
          onClick={handleExtract}
          disabled={loading}
        >
          {loading ? 'Extracting…' : tokens ? 'Re-extract' : 'Extract Tokens'}
        </button>
      </footer>
    </div>
  );
}
