import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

function useTableItems() {
  const [getTableItems, { loading, data }] = useLazyQuery<{
    queryTableItems: {
      count: number;
      items: {
        key: string;
        value: string;
      }[];
    };
  }>(gql`
    query ($projectID: UUID!, $tableName: String!) {
      queryTableItems(projectID: $projectID, tableName: $tableName) {
        count
        items {
          key
          value
        }
      }
    }
  `);

  console.log(data);

  const tableItems = data?.queryTableItems.items || [];

  return { loading, tableItems, getTableItems };
}

export default useTableItems;
