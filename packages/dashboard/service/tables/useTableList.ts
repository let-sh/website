import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

function useTableList() {
  const [getTableList, { loading, data }] = useLazyQuery<{
    listTable: {
      name: string;
      createdAt: string;
    }[];
  }>(gql`
    query ($projectID: UUID!) {
      listTable(projectID: $projectID) {
        name
        createdAt
      }
    }
  `);

  const tableList = data?.listTable || [];

  return { loading, tableList, getTableList };
}

export default useTableList;
