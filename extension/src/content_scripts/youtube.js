import browser from "webextension-polyfill";
import liveButton from "./components/live-button";

console.log("Lyspace loaded");

const ownerRenderer = document.getElementsByTagName("ytd-video-owner-renderer");

const getChannelId = (/** @type {Element | Null} */ element) => {
  const channelRoute = element
    ?.getElementsByTagName("a")[0]
    .getAttribute("href")
    ?.match(/channel\/(.*)/g);

  return String(channelRoute?.[0]).split("/")[1];
};

const trackingTimerHandler = (/** @type {Function} */ callback) => {
  const elements = document.evaluate(
    "//ytd-video-owner-renderer//child::ytd-channel-name",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const element = elements.singleNodeValue;

  if (!Boolean(element)) {
    setTimeout(trackingTimerHandler, 3000, callback);
  } else {
    callback(element);
  }
};

const ownerNameChangeHandler = (/** @type {Element} */ element) => {
  const channelId = getChannelId(element);

  element.appendChild(
    liveButton({
      service: Math.floor(Math.random() * 10) % 2 ? "twitch" : "youtube",
    })
  );
};

trackingTimerHandler(ownerNameChangeHandler);

const removeExistingLiveNowButtons = () => {
  const lyspaceButtons = ownerRenderer[0]
    ?.getElementsByTagName("ytd-channel-name")[0]
    .getElementsByTagName("lyspace-button");

  for (const lyspaceButton of lyspaceButtons) {
    lyspaceButton.parentElement?.removeChild(lyspaceButton);
  }
};

browser.runtime.onMessage.addListener(function (message, sender) {
  switch (message.type) {
    case "videoDetails": {
      const payload = JSON.parse(message.payload);

      console.log(payload);
      console.log(payload?.videoDetails?.channelId);
      break;
    }
    case "youtubeWatchUrl": {
      removeExistingLiveNowButtons();
      trackingTimerHandler(ownerNameChangeHandler);
      break;
    }
  }
});
