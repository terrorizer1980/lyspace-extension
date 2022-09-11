import browser from "webextension-polyfill";
import liveButton from "./components/live-button";
import { getLiveStreamsQuery } from "./query";
import { createClient, defaultExchanges } from "@urql/core";

console.log("Lyspace loaded");

const client = createClient({
  url: "https://gql.lyspace.co",
  exchanges: defaultExchanges,
});

const getVideoIdFromAddressBar = () => {
  const videoIdRegex = RegExp("watch\\?v=(.*)&*", "g");

  try {
    const videoId = videoIdRegex.exec(window.location.href)[1];

    return videoId;
  } catch (err) {
    console.log("Ignore the error:", err);
  }
};

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

const addYouTubeLiveButton = ({ liveStream }) => {
  const element = getChannelNameElement();

  element.appendChild(
    liveButton({
      liveStream,
    })
  );
};

const removeExistingLiveNowButtons = () => {
  const lyspaceButtons = document.getElementsByTagName("lyspace-button");
  while (lyspaceButtons.length > 0) {
    lyspaceButtons[0].remove();
  }
};

const getLiveStreams = ({ targetId }) => {
  if (targetId) {
    client
      .query(getLiveStreamsQuery, { targetId })
      .toPromise()
      .then((val) => {
        if (val.data.liveStreamQuery.livestreams) {
          const liveStream = val.data.liveStreamQuery.livestreams[0];
          const videoId = getVideoIdFromAddressBar();

          if (!liveStream?.url?.endsWith(videoId)) {
            addYouTubeLiveButton({ liveStream });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

browser.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case "playerLoaded": {
      removeExistingLiveNowButtons();

      const videoId = getVideoIdFromAddressBar();

      getLiveStreams({ targetId: videoId });

      break;
    }
    case "youtubeWatchUrl": {
      removeExistingLiveNowButtons();
      break;
    }
  }
});

// If page is directly loaded, then take channelId from meta tags
window.addEventListener("load", (_) => {
  const videoId = getVideoIdFromAddressBar();
  getLiveStreams({ targetId: videoId });
});
