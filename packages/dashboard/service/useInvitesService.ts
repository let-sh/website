import { gql } from '@apollo/client';
import React from 'react';
import { useLazyQuery } from '@apollo/client';

export interface Invitation {
  code: string;
  expired: boolean;
  createdAt: any;
  usedAt: any;
  inviteeName: string;
}

export interface User {
  id: string;
  name: string;
  gitHubID: string;
  githubName: string;
  email: string;
  isAdmin: boolean;
  avatar: string;
  projects: [];
  deployments: [];
  haveInvitations: Invitation[];
  preference: [];
  createdAt: Date;
  usedAt: Date;
}

export function useInviteService({ id }: any) {
  const variables = {
    id,
  };
  const [getInviteList, { loading, data }] = useLazyQuery<{
    user: User;
  }>(
    gql`
      query user($id: UUID) {
        user(id: $id) {
          haveInvitations {
            code
            expired
            createdAt
            usedAt
            inviteeName
          }
        }
      }
    `,
    {
      variables,
    }
  );

  return { loading, data: data?.user, getInviteList };
}
