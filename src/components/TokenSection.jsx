import { useState } from 'react';

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

export default function TokenSection({ title, items, type }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(null);

  function copy(value) {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1400);
  }

  return (
    <section className="token-section">
      <button className="section-header" onClick={() => setOpen(o => !o)}>
        <span className="section-title">{title}</span>
        <span className="section-badge">{items.length}</span>
        <span className={`section-chevron${open ? ' open' : ''}`}>›</span>
      </button>

      {open && (
        <div className={`section-body${type === 'color' ? ' color-grid' : ' token-list'}`}>
          {type === 'color'
            ? items.map(({ value }) => (
                <button key={value} className="color-chip" title={`Copy ${value}`} onClick={() => copy(value)}>
                  <span className="color-swatch" style={{ background: value }} />
                  <span className="color-hex">{value}</span>
                  {copied === value && <span className="copied-tick">✓</span>}
                </button>
              ))
            : items.map(({ label, value }) => (
                <button key={label} className="token-row" title={`Copy ${value}`} onClick={() => copy(value)}>
                  <span className="token-preview">
                    {type === 'radius' && (
                      <span className="radius-box" style={{ borderRadius: value }} />
                    )}
                    {type === 'font' && (
                      <span className="font-sample" style={{ fontFamily: value }}>Aa</span>
                    )}
                    {type === 'variable' && HEX_RE.test(value.trim()) && (
                      <span className="var-swatch" style={{ background: value.trim() }} />
                    )}
                  </span>
                  <span className="token-label">{label}</span>
                  <span className="token-value">{value}</span>
                  {copied === value && <span className="copied-tick">✓</span>}
                </button>
              ))
          }
        </div>
      )}
    </section>
  );
}
