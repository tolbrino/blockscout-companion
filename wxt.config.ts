import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',

  manifest: {
    permissions: ["activeTab", "webRequest", "webNavigation", "<all_urls>"],
  },

  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      if (wxt.config.command === "serve") {
        // During development, content script is not listed in manifest, causing
        // "webext-dynamic-content-scripts" to throw an error. So we need to
        // add it manually.
        manifest.content_scripts ??= [];
        manifest.content_scripts.push({
          matches: ["<all_urls>"],
          js: ["content-scripts/content.js"],
        });
      }
    },
  },

  runner: {
    startUrls: ["https://etherscan.io", "https://swap.cow.fi", "https://app.aave.com"],
  },
});
