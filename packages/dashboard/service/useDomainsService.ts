import { gql, useLazyQuery } from '@apollo/client';
import { PageInfo, GraphqlNode } from 'interfaces';

export interface Domains {
  domains: {
    totalCount: number;
    edges: DomainsNode[];
    pageInfo: PageInfo;
  };
}

export interface DomainsItem {
  id: string;
  subdomain: string;
  domain: string;
  cn: boolean;
  certificateStatus: string;
  channel: string;
  tldPlusOne: {
    tldPlusOne: string;
    cn: boolean;
    public: boolean;
  };
  createdAt: string;
}

export type DomainsNode = GraphqlNode<DomainsItem>;

const query = gql`
  query domains(
    $tldPlusOne: String
    $cn: Boolean
    $orderBy: DomainOrder
    $first: Int
    $last: Int
    $after: Cursor
    $before: Cursor
  ) {
    domains(
      tldPlusOne: $tldPlusOne
      cn: $cn
      first: $first
      orderBy: $orderBy
      last: $last
      after: $after
      before: $before
    ) {
      totalCount
      edges {
        node {
          id
          subdomain
          domain
          cn
          certificateStatus
          channel
          tldPlusOne {
            tldPlusOne
            cn
            public
          }
          createdAt
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
  tldPlusOne?: string;
  first?: number;
  cn?: boolean;
}

export function useDomainsService({ tldPlusOne, first = 10, cn }: Props) {
  const variables = {
    tldPlusOne,
    orderBy: {
      direction: 'DESC',
      field: 'UPDATED_AT',
    },
    first,
    cn,
  };

  const [getDomains, { loading, data }] = useLazyQuery<Domains>(query, {
    variables,
  });
  let totalCount = 0;
  let pageInfo = {
    hasNextPage: false,
    endCursor: 0,
  };
  let resData: DomainsNode[] = [];

  if (data?.domains) {
    pageInfo = data.domains.pageInfo;
    totalCount = data.domains.totalCount;
    resData = data.domains.edges;
  }

  return { loading, pageInfo, data: resData, getDomains, totalCount };
}
