import { gql } from '@apollo/client';
import { GraphqlNode } from 'interfaces';
import { useQuery } from '@apollo/client';

export interface DevelopmentInfo {
  fqdn: string;
  remotePort: number;
  remoteAddress: string;
  updatedAt: string;
  expired: boolean;
}

const query = gql`
  query ($projectID: UUID!, $orderBy: DevelopmentOrder) {
    developments(first: 1, projectID: $projectID, orderBy: $orderBy) {
      edges {
        node {
          remotePort
          remoteAddress
          fqdn
          updatedAt
          expired
        }
      }
    }
  }
`;

interface Props {
  projectID: string;
}

export function useDevelopments({ projectID }: Props, onCompleted = (data: DevelopmentInfo) => {}) {
  const variables = {
    projectID,
    orderBy: {
      direction: 'DESC',
      field: 'UPDATED_AT',
    },
  };
  const { data, loading } = useQuery<{
    developments: {
      edges: GraphqlNode<DevelopmentInfo>[];
    };
  }>(query, {
    variables,
    onCompleted: (data) => {
      onCompleted(
        data?.developments?.edges[0]?.node || {
          fqdn: '',
          updatedAt: '',
          expired: true,
          remoteAddress: '',
          remotePort: 0,
        }
      );
    },
  });

  return {
    data: data?.developments?.edges[0]?.node || {},
    loading,
  };
}
