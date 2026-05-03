# Privacy Policy

**Last updated: May 2026**

## Summary

DesignPick collects no data of any kind. Everything runs locally in your browser.

---

## Data Collection

DesignPick does **not** collect, store, transmit, or share any:

- Personal information
- Browsing history or URLs
- Page content beyond CSS styles and computed values used for the one-time extraction
- Usage analytics or telemetry

## How the Extension Works

When you click **Extract Tokens**, DesignPick injects a one-time JavaScript function into the current tab (using Chrome's `scripting` API). That function reads CSS stylesheets and computed element styles for design token values and returns them to the popup. The data lives only in the popup's memory and is discarded the moment you close the popup or click **Clear**.

No data ever leaves your machine.

## Permissions Explained

| Permission  | Why it's needed |
|-------------|-----------------|
| `activeTab` | Grants temporary access to the tab you're on when you click the extension icon. No access is granted to other tabs or without your explicit action. |
| `scripting` | Allows injecting the token-extraction function into the active tab on demand. No script is permanently installed on any page. |

## Third Parties

DesignPick does not include any third-party analytics, advertising, or tracking services. No data is sold or shared with any third party.

## Local Storage

The extension does not use `chrome.storage`, `localStorage`, `IndexedDB`, or cookies to persist any data.

## Changes to This Policy

Any material changes to this policy will be noted in the repository's commit history and reflected in the "Last updated" date above.

## Contact

For questions or concerns, open an issue at:  
https://github.com/santoshP0/designpick/issues
