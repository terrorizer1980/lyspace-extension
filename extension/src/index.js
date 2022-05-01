import * as browser from "webextension-polyfill";

console.log("Lyspace loaded");

function onComplete(details) {
  browser.tabs.sendMessage(details.tabId, {
    type: "playerLoaded",
  });
}

browser.webRequest.onCompleted.addListener(
  onComplete,
  { urls: ["*://*.youtube.com/youtubei/v1/player?*"] },
  []
);
