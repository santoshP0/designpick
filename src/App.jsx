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
      setError(
        msg.includes('Cannot access') || msg.includes('chrome://')
          ? "Can't access this page. Try a regular website."
          : msg || 'Failed to extract tokens.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setTokens(null);
    setError(null);
  }

  const hostname = tokens?.meta?.hostname || '';
  const totalCount = tokens
    ? Object.keys(tokens.cssVariables).length
      + tokens.colors.length
      + tokens.typography.fontFamilies.length
      + tokens.typography.fontSizes.length
      + tokens.radii.length
      + tokens.shadows.length
    : 0;
  const hasTokens = totalCount > 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-ring" />
        </div>
        <div className="header-text">
          <h1>DesignPick</h1>
          <span className="header-sub">{hostname || 'design token extractor'}</span>
        </div>
        {tokens && (
          <div className="header-actions">
            <span className="header-count">{totalCount} tokens</span>
            <button className="header-clear" onClick={handleClear} title="Clear results">×</button>
          </div>
        )}
      </header>

      <main className="app-main">
        {!tokens && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">⬡</div>
            <p>Navigate to any webpage and click <strong>Extract Tokens</strong> to pull its design tokens.</p>
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
            {Object.keys(tokens.cssVariables).length > 0 && (
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
