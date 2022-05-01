import * as browser from "webextension-polyfill";

console.log("Lyspace loaded");

browser.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.indexOf("youtube.com/watch") !== -1) {
    browser.tabs.sendMessage(details.tabId, { type: "youtubeWatchUrl" });
  }
});

function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let str = "";

  filter.ondata = (event) => {
    str += decoder.decode(event.data, { stream: true });
  };

  filter.onstop = (event) => {
    browser.tabs.sendMessage(details.tabId, {
      type: "videoDetails",
      payload: str,
    });
    filter.write(encoder.encode(str));
    filter.disconnect();
  };

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: ["*://*.youtube.com/youtubei/v1/player?*"] },
  ["blocking"]
);
