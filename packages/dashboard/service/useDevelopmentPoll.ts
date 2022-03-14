import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

export interface Development {
  requestUrl: string;
  requestMethod: string;
  requestHeader: string;
  requestBody: string;
  responseHeader: string;
  responseBody: string;
  statusCode: number;
  ts: number;
}

interface DevelopmentRequests {
  developmentRequests: Development[];
}

const query = gql`
  query development($projectID: UUID!, $limit: Int, $startTime: Time, $endTime: Time) {
    developmentRequests(
      projectID: $projectID
      limit: $limit
      startTime: $startTime
      endTime: $endTime
    ) {
      requestUrl
      requestMethod
      requestHeader
      requestBody
      responseHeader
      responseBody
      statusCode
      ts
    }
  }
`;

function useDevelopmentPoll() {
  const [getDevelopment, { loading, data, startPolling, stopPolling }] =
    useLazyQuery<DevelopmentRequests>(query);

  return {
    getDevelopment,
    startPolling,
    stopPolling,
    loading,
    data: data || [],
  };
}

export default useDevelopmentPoll;
