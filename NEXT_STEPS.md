# Next Steps — Publishing DesignPick

Everything in the repo is code-complete. These are the remaining manual tasks before the extension goes live.

---

## 1. Take Screenshots

The Chrome Web Store requires **at least 1 screenshot** at **1280×800** or **640×400** px (PNG or JPEG).

1. Run `npm run build`
2. Open `chrome://extensions` → Enable **Developer mode** → **Load unpacked** → select `dist/`
3. Navigate to a design-rich site (e.g. [stripe.com](https://stripe.com), [linear.app](https://linear.app))
4. Click the DesignPick icon → click **Extract Tokens**
5. Screenshot the popup (suggested tool: Chrome's built-in screenshot via DevTools, or any screen capture app)
6. Aim for 4–5 screenshots showing different sections (Colors, Typography, Export panel)

See `store/listing.md` for the full screenshot checklist.

---

## 2. Host the Privacy Policy

The Chrome Web Store requires a **public URL** for the privacy policy even for extensions that collect no data.

**Quickest option:**
- Go to your repo → Settings → Pages → Source: `main` branch, `/ (root)` folder → Save
- Your policy will be live at: `https://santoshP0.github.io/designpick/PRIVACY`  
  *(GitHub Pages serves Markdown files — you may want to rename to `privacy.html` or create a simple HTML wrapper)*

**Alternative:** Use the raw GitHub URL directly:
```
https://raw.githubusercontent.com/santoshP0/designpick/main/PRIVACY.md
```

---

## 3. Register a Chrome Web Store Developer Account

- Go to: https://chrome.google.com/webstore/devconsole
- Sign in with a Google account
- Pay the **one-time $5 registration fee**
- *(Skip if you already have a developer account)*

---

## 4. Submit the Extension

1. Run `npm run package` → produces `designpick-v1.0.0.zip`
2. Go to the [Developer Dashboard](https://chrome.google.com/webstore/devconsole) → **New Item**
3. Upload `designpick-v1.0.0.zip`
4. Fill in the store listing using the text in `store/listing.md`
5. Paste your privacy policy URL (from Step 2)
6. Upload your screenshots (from Step 1)
7. Set visibility → **Public**
8. Click **Submit for review**

Review typically takes **1–3 business days**.

---

## 5. After Approval

- [ ] Pin the extension in Chrome and do a final smoke test on a live site
- [ ] Add the Chrome Web Store badge/link to `README.md`
- [ ] Tag the release in git: `git tag v1.0.0 && git push --tags`

---

## Summary

| Step | Time estimate | Blocker? |
|------|--------------|----------|
| Screenshots | ~15 min | Yes — store won't accept without at least 1 |
| Host privacy policy | ~5 min | Yes — required field |
| Dev account + $5 fee | ~5 min | Yes — one-time |
| Fill dashboard + submit | ~15 min | Yes |
| Wait for review | 1–3 days | — |
