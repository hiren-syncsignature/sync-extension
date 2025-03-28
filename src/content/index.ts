/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectedSignature } from "../types/index";

// console.log("SyncSignature content script loaded");

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  // console.log("Content script received message:", request);

  if (request.action === "getLocalStorageItem") {
    try {
      const value = localStorage.getItem(request.key);
      sendResponse({ value: value });
    } catch (e) {
      sendResponse({
        error: e instanceof Error ? e.toString() : "Unknown error",
      });
    }
    return true; // Required for async response
  } else if (request.action === "insertSignature") {
    // console.log("Inserting signature:", request.signatureHtml);
    sendResponse({ success: true });
    return true;
  }
  return false;
});

// Set to track compose elements that have already been processed
const processedComposeElements = new WeakSet<HTMLElement>();

/**
 * Inserts the signature into the compose element
 */
function insertSignature(composeElement: HTMLElement, signature: string): void {
  let currentElement: HTMLElement | null = composeElement;
  let topComposeElement: HTMLElement | null = null;

  // Find the top-level compose element
  while (currentElement) {
    if (isComposeElement(currentElement)) {
      topComposeElement = currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  // Only process the top-level compose element
  if (composeElement !== topComposeElement) {
    // console.log("Skipping nested compose element (not topmost).");
    return;
  }

  // Skip if already processed
  if (processedComposeElements.has(composeElement)) {
    // console.log("Compose element already processed. Skipping insertion.");
    return;
  }

  // Skip if signature already inserted
  if (composeElement.querySelector(".SyncSignature")) {
    // console.log("Signature container already exists. Skipping insertion.");
    processedComposeElements.add(composeElement);
    return;
  }

  // Skip if data attribute indicates already inserted
  if (composeElement.getAttribute("data-signature-inserted") === "true") {
    processedComposeElements.add(composeElement);
    return;
  }

  // console.log("Inserting signature into compose window");
  composeElement.innerHTML = "";
  composeElement.insertAdjacentHTML(
    "beforeend",
    `<br><br><br><div class="SyncSignature" style="margin-top: 10px;">${signature}</div>`
  );

  composeElement.setAttribute("data-signature-inserted", "true");
  processedComposeElements.add(composeElement);
}

/**
 * Checks if the given node is the Gmail compose field
 */
function isComposeElement(node: Node): node is HTMLElement {
  return (
    node instanceof HTMLElement &&
    node.matches('div[aria-label="Message Body"]')
  );
}

/**
 * Gets the saved signature and inserts it
 */
function tryInsertSignature(composeElement: HTMLElement): void {
  chrome.storage.local.get(
    "selectedSignature",
    (data: { selectedSignature?: SelectedSignature }) => {
      if (chrome.runtime.lastError) {
        // console.error(
        //   "Error retrieving signature from storage:",
        //   chrome.runtime.lastError
        // );
        return;
      }

      if (data.selectedSignature && data.selectedSignature.content) {
        // console.log("Found saved signature:", data.selectedSignature);
        insertSignature(composeElement, data.selectedSignature.content);
      } else {
        // console.log("No valid signature found in storage.");
      }
    }
  );
}

// Only run this code on Gmail
if (window.location.hostname === "mail.google.com") {
  // Wait for the page to load more fully
  setTimeout(() => {
    // Create observer to watch for new compose windows
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (isComposeElement(node)) {
              // console.log("Compose element detected directly:", node);
              tryInsertSignature(node);
            } else {
              // Look for compose fields in this subtree
              const composeFields = (node as HTMLElement).querySelectorAll(
                'div[aria-label="Message Body"]'
              );
              if (composeFields.length) {
                composeFields.forEach((field: any) => {
                  tryInsertSignature(field as HTMLElement);
                });
              }
            }
          }
        });
      });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

    // Check for existing compose fields
    const existingComposeFields = document.querySelectorAll(
      'div[aria-label="Message Body"]'
    );
    if (existingComposeFields.length) {
      existingComposeFields.forEach((field) => {
        tryInsertSignature(field as HTMLElement);
      });
    }
  }, 1000);
}
