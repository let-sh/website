import { BrowserRouter as Router } from 'react-router-dom';
import Console from '../../components/console';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, split } from '@apollo/client';
import { InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition, relayStylePagination } from '@apollo/client/utilities';
import { Provider } from 'react-redux';
import { store } from 'components/console/store';
import CommonHead from 'components/common/head';

function createClient() {
  const httpLink = new HttpLink({
    uri: 'https://api.let-sh.com/query',
    headers: localStorage.getItem('token')
      ? { Authorization: `bearer ${localStorage.getItem('token')}` }
      : {},
  });
  const wsLink = new WebSocketLink({
    uri: 'wss://api.let-sh.com/query',
    options: {
      reconnect: true,
      connectionParams: localStorage.getItem('token')
        ? { Authorization: `bearer ${localStorage.getItem('token')}` }
        : {},
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );
  const client = new ApolloClient({
    ssrMode: true,
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      splitLink,
    ]),
    cache: new InMemoryCache(),
  });

  return client;
}

export default function ConsoleApp() {
  if (typeof window === 'undefined') {
    return null;
  }
  const client = createClient();
  return (
    <ApolloProvider client={client}>
     
        <Provider store={store}>
          <Router>
            <CommonHead />
            <Console />
          </Router>
        </Provider>
    </ApolloProvider>
  );
}
