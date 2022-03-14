import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { PageInfo, GraphqlNode } from 'interfaces';

export interface Deployments {
  deployments: {
    edges: DeploymentsNode[];
    pageInfo: PageInfo;
  };
}

export interface Score {
  bestPractice: number;
  accessibility: number;
  performance: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  fullReport: string;
}

export interface Runtime {
  ram: number;
  region: string;
}

export interface DeploymentsItem {
  id: string;
  version: number;
  status: string;
  channel: string;
  cn: boolean;
  type: string;
  score: Score;
  runtime: Runtime;
  containsDynamic: boolean;
}

type DeploymentsNode = GraphqlNode<DeploymentsItem>;

const query = gql`
  query deployments($projectName: String, $orderBy: DeploymentOrder, $first: Int, $cursor: Cursor) {
    deployments(projectName: $projectName, first: $first, orderBy: $orderBy, after: $cursor) {
      edges {
        node {
          id
          version
          type
          bundleID
          containsDynamic
          status
          channel
          cn
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const singleQuery = gql`
  query deployment($id: UUID) {
    deployment(id: $id) {
      id
      version
      type
      bundleID
      containsDynamic
      status
      channel
      cn
      score {
        bestPractice
        accessibility
        performance
        largestContentfulPaint
        cumulativeLayoutShift
        totalBlockingTime
        fullReport
      }
      runtime {
        ram
        region
      }
    }
  }
`;

interface Props {
  projectName: string;
  first?: number;
  channel?: string;
}

export function useDeploymentDetailsService({ projectName }: Props) {
  const variables = {
    projectName,
    orderBy: {
      direction: 'DESC',
      field: 'UPDATED_AT',
    },
    first: 10,
  };

  const [getDeploymentDetails, { loading, data, fetchMore }] = useLazyQuery<Deployments>(query, {
    variables,
  });

  let deploymentDetails: DeploymentsItem | null = null;
  let type = '';
  let containsDynamic = false;
  let deployments: DeploymentsNode[] = [];
  let hasNextPage = false;
  let endCursor = 0;

  if (data?.deployments) {
    type = data.deployments.edges[0].node.type;
    containsDynamic = data.deployments.edges[0].node.containsDynamic;
    deploymentDetails = data.deployments.edges[0].node;
    deployments = data.deployments.edges;
    hasNextPage = data.deployments.pageInfo.hasNextPage;
    endCursor = data.deployments.pageInfo.endCursor;
  }

  return {
    loading,
    getDeploymentDetails,
    deploymentDetails: deploymentDetails,
    projectType: type,
    containsDynamic,
    deployments,
    hasNextPage,
    endCursor,
    fetchMore: fetchMore || (() => {}),
  };
}

export function useSingleDeploymentDetailsService(
  onCompleted = (data: { deployment: DeploymentsItem }) => {}
) {
  const [getDeploymentDetails, { loading, data }] = useLazyQuery<{
    deployment: DeploymentsItem;
  }>(singleQuery, {
    onCompleted,
  });

  let score: Score | null = null;
  let runtime: Runtime | null = null;
  let type = '';
  let deploymentDetails: DeploymentsItem | null = null;

  if (data?.deployment) {
    score = data.deployment.score;
    runtime = data.deployment.runtime;
    type = data.deployment.type;
    deploymentDetails = data.deployment;
  }

  return {
    loading,
    score: score,
    runtime: runtime,
    getDeploymentDetails,
    projectType: type,
  };
}
