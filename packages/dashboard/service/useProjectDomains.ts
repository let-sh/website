import { useLazyQuery, gql } from '@apollo/client';
import type { ProjectDomain } from './types';

const query = gql`
  query project($name: String) {
    project(name: $name) {
      id
      domains {
        domain
        id
        cn
        certificateStatus
        channel
      }
    }
  }
`;

interface Props {
  projectName: string;
}

export function useProjectDomainsService({ projectName }: Props) {
  const variables = {
    name: projectName,
  };

  const [getProjectDomains, { loading, data }] = useLazyQuery<{
    project: {
      domains: ProjectDomain[];
      id: string;
    };
  }>(query, {
    variables,
  });
  let totalCount = 0;
  let pageInfo = {
    hasNextPage: false,
    endCursor: 0,
  };

  return { loading, pageInfo, data: data?.project, getProjectDomains, totalCount };
}
