import { gql } from "@urql/core";

export const getLiveStreamsQuery = gql`
  query getLiveStreams($targetId: String!) {
    liveStreamQuery {
      livestreams(
        input: { targetId: $targetId, serviceName: YOUTUBE, targetType: VIDEO }
      ) {
        id
        title
        url
        serviceName
      }
    }
  }
`;
