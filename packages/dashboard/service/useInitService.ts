import { gql } from '@apollo/client';

const INIT_QUERY = gql`
  query {
    allPreference {
      timezone
      channel
    }
  }
`;

function useInitService() {}

export default useInitService;
