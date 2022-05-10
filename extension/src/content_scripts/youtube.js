import browser from "webextension-polyfill";
import liveButton from "./components/live-button";
import { getLiveStreamsQuery } from "./query";
import { createClient, defaultExchanges } from "@urql/core";

console.log("Lyspace loaded");

const client = createClient({
  url: "https://gql.lyspace.co",
  exchanges: defaultExchanges,
});

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

const getLiveStreams = ({ channelId }) => {
  client
    .query(getLiveStreamsQuery, { channelId })
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

browser.runtime.onMessage.addListener(function (message, sender) {
  switch (message.type) {
    case "playerLoaded": {
      removeExistingLiveNowButtons();

      if (window.location.href.indexOf("youtube.com/watch") !== -1) {
        setTimeout(() => {
          const channelId = getChannelId();

          getLiveStreams({ channelId });
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

// If page is directly loaded, then take channelId from meta tags
window.addEventListener("load", (_) => {
  const elements = document.evaluate(
    "//meta[@itemprop='channelId']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const element = elements.singleNodeValue;
  const channelId = element.getAttribute("content");

  getLiveStreams({ channelId });
});
