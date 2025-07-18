/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectedSignature } from "../types/index";

// console.log("✅ SyncSignature: Content script is active.");

// --- SELECTORS ---
const GMAIL_SELECTOR = 'div[aria-label="Message Body"]';
const OUTLOOK_SELECTOR = 'div[aria-label="Message body, press Alt+F10 to exit"]';
const ICLOUD_SELECTOR = '.RichTextEditor-body'; // This is a placeholder selector
const allComposeSelectors = [GMAIL_SELECTOR, OUTLOOK_SELECTOR, ICLOUD_SELECTOR].join(", ");

const processedComposeElements = new WeakSet<HTMLElement>();

// --- CORE FUNCTIONS ---

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getLocalStorageItem") {
    try {
      const value = localStorage.getItem(request.key);
      sendResponse({ value: value });
    } catch (e) {
      sendResponse({
        error: e instanceof Error ? e.toString() : "Unknown error",
      });
    }
    return true;
  } else if (request.action === "insertSignature") {
    sendResponse({ success: true });
    return true;
  }
  return false;
});

function insertSignature(composeElement: HTMLElement, signature: string): void {
  // A new log to show we're using the special wrapper
  console.log("%c✅ SyncSignature: Inserting signature with Outlook 'contenteditable' wrapper.", "color: blue; font-weight: bold;");

  // Clear the compose box
  composeElement.innerHTML = "";

  // This is the new, more powerful wrapper.
  const outlookMagicWrapper = `
    <br><br><br>
    <div class="SyncSignature" contenteditable="false"">
    ${signature}
    </div>
  `;

  composeElement.insertAdjacentHTML("beforeend", outlookMagicWrapper);
  composeElement.setAttribute("data-signature-inserted", "true");
}

function tryInsertSignature(composeElement: HTMLElement): void {
  if (processedComposeElements.has(composeElement)) {
    return;
  }

  chrome.storage.local.get("syncSignatureStatus", (status) => {
    if (status.syncSignatureStatus?.isEnabled === false) {
      console.log("SyncSignature is disabled. Skipping insertion.");
      return;
    }
    chrome.storage.local.get(
      "selectedSignature",
      (data: { selectedSignature?: SelectedSignature }) => {
        if (chrome.runtime.lastError) {
          console.error(
            "❌ SyncSignature: Error retrieving signature from storage:",
            chrome.runtime.lastError
          );
          return;
        }
        if (data.selectedSignature && data.selectedSignature.content) {
          insertSignature(composeElement, data.selectedSignature.content);
        } else {
          console.warn("⚠️ SyncSignature: No valid signature was found in storage.");
        }
      }
    );

    processedComposeElements.add(composeElement);
  });
}

function findAndProcessComposeBox(elementToSearch: HTMLElement) {
    if (elementToSearch.matches(allComposeSelectors)) {
        tryInsertSignature(elementToSearch);
    } else {
        const composeFields = elementToSearch.querySelectorAll(allComposeSelectors);
        composeFields.forEach(field => tryInsertSignature(field as HTMLElement));
    }
}

const supportedHosts = ["mail.google.com", "outlook.live.com", "outlook.office.com", "www.icloud.com"];

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
      elementsToScan.forEach(findAndProcessComposeBox);
    });

    mainObserver.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });

    const existingComposeFields = document.querySelectorAll(allComposeSelectors);
    if (existingComposeFields.length > 0) {
      existingComposeFields.forEach((field) => tryInsertSignature(field as HTMLElement));
    }
  }, 1500);
}