import browser from "webextension-polyfill";
import liveButton from "./components/live-button";

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
  removeExistingLiveNowButtons();
  trackingTimerHandler(ownerNameChangeHandler);
});
