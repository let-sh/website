import { useLazyQuery, gql } from '@apollo/client';
import type { DeploymentsItem } from './useDeploymentsService';
import { PageInfo } from 'interfaces';
import { useEffect } from 'react';

export interface Projects {
  projects: {
    totalCount: number;
    edges: ProjectsNode[];
    pageInfo: PageInfo;
  };
}

export interface ProjectsNode {
  node: {
    id: string;
    name: string;
    createdAt: string;
  };
}

const query = gql`
  query projects($orderBy: ProjectOrder, $first: Int, $last: Int, $after: Cursor, $before: Cursor) {
    projects(first: $first, orderBy: $orderBy, last: $last, after: $after, before: $before) {
      totalCount
      edges {
        node {
          id
          name
          description
          createdAt
          updatedAt
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
  first?: number;
  fetchOnMount?: boolean;
}

export function useProjectsService({ first = 10, fetchOnMount = false }: Props = {}) {
  const variables = {
    orderBy: {
      direction: 'DESC',
      field: 'UPDATED_AT',
    },
    first,
  };

  const [getProjects, { loading, data }] = useLazyQuery<Projects>(query, {
    variables,
  });
  let totalCount = 0;
  let pageInfo = {
    hasNextPage: false,
    endCursor: 0,
  };
  let resData: ProjectsNode[] = [];

  useEffect(() => {
    if (fetchOnMount) {
      console.log(variables);
      getProjects();
    }
  }, []);

  if (data?.projects) {
    pageInfo = data.projects.pageInfo;
    totalCount = data.projects.totalCount;
    resData = data.projects.edges;
  }

  return { loading, pageInfo, data: resData, getProjects, totalCount };
}
