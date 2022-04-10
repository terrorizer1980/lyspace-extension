import * as browser from "webextension-polyfill";

browser.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.indexOf("youtube.com/watch") !== -1) {
    browser.tabs.sendMessage(details.tabId, details);
  }
});
