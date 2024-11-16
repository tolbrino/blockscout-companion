// Data types as defined in https://eips.ethereum.org/EIPS/eip-3091
const types = ['address', 'token', 'tx', 'block'];

// Blockscout compatibility docs can be found at
// https://docs.blockscout.com/devs/replace-links
const domainMap = {
  'https://etherscan.io': 'https://eth.blockscout.com',
  'https://sepolia.etherscan.io': 'https://eth-sepolia.blockscout.com',
  'https://optimistic.etherscan.io': 'https://optimism.blockscout.com',
  'https://sepolia-optimism.etherscan.io': 'https://optimism-sepolia.blockscout.com',
  'https://basescan.org': 'https://base.blockscout.com',
  'https://sepolia.basescan.org': 'https://base-sepolia.blockscout.com',
  'https://arbiscan.io': 'https://arbitrum.blockscout.com',
  'https://sepolia.arbiscan.io': 'https://arbitrum-sepolia.blockscout.com',
  'https://polygonscan.com': 'https://polygon.blockscout.com',
  'https://gnosisscan.io': 'https://gnosis.blockscout.com'
};

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {

    // Replaces all links in the node which adhere to the supported domains
    // and data types.
    function replaceLinks(node: any) {
      const links = document.querySelectorAll('a');

      links.forEach((link) => {
        for (const [esDomain, bsDomain] of Object.entries(domainMap)) {
          types.forEach((dataType) => {
            const linkPrefix = `${esDomain}/${dataType}/`;
            const linkPrefixTarget = `${bsDomain}/${dataType}/`;

            // only rewrite href if the link will change
            if (link.href.startsWith(linkPrefix)) {
              const href =  link.href.replace(linkPrefix, linkPrefixTarget);
              link.setAttribute('href', href);
            }
          })
        }
      })
    }

    // one-off replacement for initial page load
    replaceLinks(document.body);

    // as the page loads more data and links the observer will trigger
    // further replacements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const newNode = mutation.addedNodes[i];
            replaceLinks(newNode);
          }
        }
      });
    });

    // register observer
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
});
