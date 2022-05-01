import browser from "webextension-polyfill";
import liveButton from "./components/live-button";

console.log("Lyspace loaded");

const getChannelNameElement = () => {
  const elements = document.evaluate(
    "//ytd-video-owner-renderer//child::ytd-channel-name",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  return elements.singleNodeValue;
};

const getChannelId = () => {
  const element = getChannelNameElement();

  const channelRoute = element
    ?.getElementsByTagName("a")[0]
    .getAttribute("href")
    ?.match(/channel\/(.*)/g);

  return String(channelRoute?.[0]).split("/")[1];
};

const ownerNameChangeHandler = () => {
  const element = getChannelNameElement();

  element.appendChild(
    liveButton({
      service: Math.floor(Math.random() * 10) % 2 ? "twitch" : "youtube",
    })
  );
};

const removeExistingLiveNowButtons = () => {
  const lyspaceButtons = document.getElementsByTagName("lyspace-button");
  while (lyspaceButtons.length > 0) {
    lyspaceButtons[0].remove();
  }
};

browser.runtime.onMessage.addListener(function (message, sender) {
  switch (message.type) {
    case "playerLoaded": {
      removeExistingLiveNowButtons();

      if (window.location.href.indexOf("youtube.com/watch") !== -1) {
        setTimeout(() => {
          const channelId = getChannelId();
          console.log(channelId);
          ownerNameChangeHandler();
        }, 1000);
      }

      break;
    }
    case "youtubeWatchUrl": {
      removeExistingLiveNowButtons();
      break;
    }
  }
});

// Initially, take channelId from the meta tag
window.addEventListener("load", (_) => {
  const elements = document.evaluate(
    "//meta[@itemprop='channelId']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const element = elements.singleNodeValue;
  console.log(element.getAttribute("content"));

  ownerNameChangeHandler();
});
