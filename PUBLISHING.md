# Publishing DesignPick to the Chrome Web Store

## Pre-submission Checklist

- [ ] Build passes cleanly: `npm run build`
- [ ] Extension loads and works when installed as unpacked from `dist/`
- [ ] Tested on at least 3 different websites
- [ ] Tested edge cases: `chrome://` page (should show friendly error), page with no tokens
- [ ] Privacy policy hosted at a public URL (see step 3)
- [ ] At least 1 screenshot at 1280×800 or 640×400 prepared (see `store/listing.md`)
- [ ] Developer account registered at https://chrome.google.com/webstore/devconsole
- [ ] One-time $5 developer registration fee paid

---

## Step 1 — Build and Package

```bash
npm run package
```

This runs the full build and produces `designpick-v1.0.0.zip` in the project root.  
On Windows without `zip`: `powershell Compress-Archive dist designpick-v1.0.0.zip`

---

## Step 2 — Developer Console

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Click **New Item**
4. Upload `designpick-v1.0.0.zip`

---

## Step 3 — Host the Privacy Policy

The store requires a public privacy policy URL even for extensions that collect no data.

**Quickest option — GitHub Pages:**
1. Enable GitHub Pages on the repo (Settings → Pages → Branch: `main`, folder: `/`)
2. Add `privacy.html` or use the raw file URL:  
   `https://raw.githubusercontent.com/santoshP0/designpick/main/PRIVACY.md`

Paste the URL into the **Privacy practices** field in the developer dashboard.

---

## Step 4 — Fill in the Store Listing

Copy the text from `store/listing.md` into the corresponding fields:

| Dashboard field        | Source |
|------------------------|--------|
| Name                   | `store/listing.md` → Extension Name |
| Short description      | `store/listing.md` → Short Description |
| Detailed description   | `store/listing.md` → Detailed Description |
| Category               | Developer Tools |
| Language               | English |
| Privacy policy URL     | Your hosted URL from Step 3 |

---

## Step 5 — Upload Screenshots

See `store/listing.md` for screenshot guidance. Minimum: 1 screenshot.

---

## Step 6 — Submit for Review

1. Set visibility to **Public** (or **Unlisted** for soft launch)
2. Click **Submit for review**
3. Review typically takes 1–3 business days for new extensions

---

## Updating the Extension

1. Bump `version` in `package.json` **and** `public/manifest.json` (must match)
2. `npm run package` → new zip
3. In the Developer Dashboard → select the extension → **Upload new package**

---

## Version Numbering

Follow [semver](https://semver.org):
- Patch `1.0.x` — bug fixes, minor extraction improvements
- Minor `1.x.0` — new token categories, new export formats, UI improvements
- Major `x.0.0` — breaking changes to the export format or manifest

> Chrome Web Store does not allow downgrading the version number once published.

---

## Useful Links

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Extension publishing docs](https://developer.chrome.com/docs/webstore/publish/)
- [Manifest V3 overview](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Extension quality guidelines](https://developer.chrome.com/docs/webstore/program-policies/)
