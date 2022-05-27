import browser from "webextension-polyfill";
import liveButton from "./components/live-button";
import { getLiveStreamsQuery } from "./query";
import { createClient, defaultExchanges } from "@urql/core";

console.log("Lyspace loaded");

const client = createClient({
  url: "https://gql.lyspace.co",
  exchanges: defaultExchanges,
});

const getVideoIdFromElement = () => {
  const videoIdRegex = RegExp("watch\\?v=(.*)&*", "g");
  const videoId = videoIdRegex.exec(window.location.href)[1];

  return videoId;
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
  client
    .query(getLiveStreamsQuery, { targetId })
    .toPromise()
    .then((val) => {
      if (val.data.liveStreamQuery.livestreams) {
        const liveStream = val.data.liveStreamQuery.livestreams[0];

        addYouTubeLiveButton({ liveStream });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

browser.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case "playerLoaded": {
      removeExistingLiveNowButtons();

      const videoId = getVideoIdFromElement();

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
  const videoId = getVideoIdFromElement();
  getLiveStreams({ targetId: videoId });
});
