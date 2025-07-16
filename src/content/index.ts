/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectedSignature } from "../types/index";

console.log("✅ SyncSignature: Content script is active.");

// --- SELECTORS ---
const GMAIL_SELECTOR = 'div[aria-label="Message Body"]';
const OUTLOOK_SELECTOR = 'div[aria-label="Message body, press Alt+F10 to exit"]';
const allComposeSelectors = [GMAIL_SELECTOR, OUTLOOK_SELECTOR].join(", ");

const processedComposeElements = new WeakSet<HTMLElement>();

// --- CORE FUNCTIONS ---

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getLocalStorageItem") { try { const value = localStorage.getItem(request.key); sendResponse({ value: value }); } catch (e) { sendResponse({ error: e instanceof Error ? e.toString() : "Unknown error", }); } return true; } else if (request.action === "insertSignature") { sendResponse({ success: true }); return true; } return false;
});

function insertSignature(composeElement: HTMLElement, signature: string): void {
  // Final, successful insertion log.
  console.log("%c✅ SyncSignature: Signature successfully inserted.", "color: green; font-weight: bold;", composeElement);
  composeElement.innerHTML = "";
  composeElement.insertAdjacentHTML("beforeend", `<br><br><br><div class="SyncSignature" style="margin-top: 10px;">${signature}</div>`);
  composeElement.setAttribute("data-signature-inserted", "true");
}

function tryInsertSignature(composeElement: HTMLElement): void {
  // This is the most important check. If we've seen this element before, do nothing.
  if (processedComposeElements.has(composeElement)) {
    return;
  }
  
  chrome.storage.local.get("selectedSignature", (data: { selectedSignature?: SelectedSignature }) => {
    if (chrome.runtime.lastError) { 
        console.error("❌ SyncSignature: Error retrieving signature from storage:", chrome.runtime.lastError); 
        return; 
    }
    if (data.selectedSignature && data.selectedSignature.content) {
      insertSignature(composeElement, data.selectedSignature.content);
    } else {
      console.warn("⚠️ SyncSignature: No valid signature was found in storage.");
    }
  });

  // Mark this element as processed so we never touch it again.
  processedComposeElements.add(composeElement);
}

function findAndProcessComposeBox(elementToSearch: HTMLElement) {
    if (elementToSearch.matches(allComposeSelectors)) {
        tryInsertSignature(elementToSearch);
    } else {
        const composeFields = elementToSearch.querySelectorAll(allComposeSelectors);
        composeFields.forEach(field => tryInsertSignature(field as HTMLElement));
    }
}

// --- INITIALIZATION LOGIC ---
const supportedHosts = ["mail.google.com", "outlook.live.com", "outlook.office.com"];

if (supportedHosts.includes(window.location.hostname)) {
  setTimeout(() => {
    const mainObserver = new MutationObserver((mutations) => {
      const elementsToScan = new Set<HTMLElement>();
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) elementsToScan.add(node);
          }
        } else if (mutation.type === 'attributes') {
          if (mutation.target instanceof HTMLElement) elementsToScan.add(mutation.target);
        }
      }
      // This will now silently check all mutated elements.
      elementsToScan.forEach(findAndProcessComposeBox);
    });

    mainObserver.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });

    // Initial check on page load (runs once).
    const existingComposeFields = document.querySelectorAll(allComposeSelectors);
    if (existingComposeFields.length > 0) {
      existingComposeFields.forEach((field) => tryInsertSignature(field as HTMLElement));
    }
  }, 1500);
}