import * as browser from "webextension-polyfill";

const ownerRenderer = document.getElementsByTagName("ytd-video-owner-renderer");

const getChannelId = (/** @type {Element | Null} */ element) => {
  const channelRoute = element
    ?.getElementsByTagName("a")[0]
    .getAttribute("href")
    ?.match(/channel\/(.*)/g);

  return String(channelRoute?.[0]).split("/")[1];
};

const trackingTimerHandler = (/** @type {Function} */ callback) => {
  const element = ownerRenderer[0]?.getElementsByTagName("ytd-channel-name")[0];

  console.log("ME:", getChannelId(element));

  if (!Boolean(element)) {
    setTimeout(trackingTimerHandler, 3000, callback);
  } else {
    callback(getChannelId(element));
  }
};

trackingTimerHandler((/** @type {String} */ channelId) => {
  console.log("ME:", channelId);
});

browser.runtime.onMessage.addListener(function (message, sender) {
  trackingTimerHandler((/** @type {String} */ channelId) => {
    console.log("TE:", channelId);
  });
});
