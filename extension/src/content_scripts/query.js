import { gql } from '@urql/core';

export const getLiveStreamsQuery = gql`
  query getLiveStreams($channelId: String!) {
    liveStreamQuery {
      livestreams(input: {channelId: $channelId, serviceName: YOUTUBE}) {
        id
        title
        videoId
        serviceName
        isLive
      }
    }
  }
`
