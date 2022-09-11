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

// Just had to add for chrome because manifest v3 doesn't triggers .onComplete if service worker is inactive
const shouldAddTabChangeListener = new Promise(async (resolve, reject) => {
  try {
    const details = await browser.runtime.getBrowserInfo();

    if (details?.vendor === "Mozilla") {
      return reject("It's Mozilla");
    }
  } catch (err) {}

  return resolve();
});

shouldAddTabChangeListener
  .then(() => {
    browser.tabs.onUpdated.addListener(() => {
      // do nothing. it's just to activate service worker in chrome
      // because `webRequest.onCompleted` doesn't get triggered when inactive
    });
  })
  .catch((err) => {
    console.log(err);
  });
