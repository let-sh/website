import { useLazyQuery, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { PageInfo, GraphqlNode } from 'interfaces';

export interface Deployments {
  deployments: {
    totalCount: number;
    edges: DeploymentsNode[];
    pageInfo: PageInfo;
  };
}
export interface DeploymentsItem {
  id: string;
  targetFQDN: string;
  updatedAt: string;
  createdAt: string;
  status: string;
  type: string;
  channel: string;
  cn: boolean;
  version: number;
  containsDynamic: boolean;
}

export type DeploymentsNode = GraphqlNode<DeploymentsItem>;

const query = gql`
  query deployments(
    $projectName: String
    $orderBy: DeploymentOrder
    $first: Int
    $last: Int
    $after: Cursor
    $before: Cursor
    $channel: String
  ) {
    deployments(
      projectName: $projectName
      first: $first
      orderBy: $orderBy
      last: $last
      after: $after
      before: $before
      channel: $channel
    ) @connection(key: "deployments-details") {
      totalCount
      edges {
        node {
          id
          version
          type
          channel
          targetFQDN
          updatedAt
          createdAt
          status
          cn
          containsDynamic
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

interface Props {
  projectName: string;
  first?: number;
  channel?: string;
}

export function useDeploymentsService({ projectName, first = 10, channel }: Props) {
  const variables = {
    projectName,
    orderBy: {
      direction: 'DESC',
      field: 'UPDATED_AT',
    },
    first,
    channel,
  };

  const { loading, data, fetchMore } = useQuery<Deployments>(query, {
    variables,
  });
  let totalCount = 0;
  let pageInfo = {
    hasNextPage: false,
    endCursor: 0,
  };
  let resData: DeploymentsNode[] = [];

  if (data?.deployments) {
    pageInfo = data.deployments.pageInfo;
    totalCount = data.deployments.totalCount;
    resData = data.deployments.edges;
  }

  return {
    loading,
    pageInfo,
    data: resData,
    totalCount,
    fetchMore: fetchMore || (() => {}),
  };
}
