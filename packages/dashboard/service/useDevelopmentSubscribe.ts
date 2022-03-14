import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client';

interface DevelopmentResponse {
  requestUrl: string;
  requestBody: string;
  requestMethod: string;
  requestHeader: string;
  responseBody: string;
  responseHeader: string;
  duration: number;
  statusCode: number;
  ts: string;
}

interface DevelopmentSub {
  developmentRequests: DevelopmentResponse;
}

const query = gql`
  subscription developmentRequests($projectID: UUID!) {
    developmentRequests(projectID: $projectID) {
      requestUrl
      requestBody
      requestMethod
      requestHeader
      responseBody
      responseHeader
      duration
      statusCode
      ts
    }
  }
`;

export function useDevelopmentSubscribe(
  projectID: string,
  onSubscriptionData = (data: DevelopmentResponse) => {}
) {
  return useSubscription<DevelopmentSub>(query, {
    variables: {
      projectID,
    },
    onSubscriptionData: (data) => {
      const request = data.subscriptionData.data?.developmentRequests;
      if (!request) {
        return;
      }
      onSubscriptionData(request);
    },
  });
}
