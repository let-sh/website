// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export interface PageInfo {
  startCursor: number;
  endCursor: number;
  hasNextPage: boolean;
}

export type GraphqlNode<T> = {
  node: T;
};
