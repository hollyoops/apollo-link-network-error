import { ApolloLink, Observable, execute } from '@apollo/client/core';
import { NetworkErrorLink, NetworkErrorHandler } from '../NetworkErrorLink'
import gql from 'graphql-tag'

export const FAKE_QUERY = gql`
  query FakeQuery {
    stub {
      id
    }
  }
`

const createNetworkErrorLink = (handler: NetworkErrorHandler) => {
  const nextLink = new ApolloLink(
    () =>
      new Observable(observer => {
        observer.error(Error('network error'))
      })
  )
  const errorLink = new NetworkErrorLink(handler)
  return errorLink.concat(nextLink)
}

export const getFakeNetworkErrorLink = (handler: NetworkErrorHandler) => {
  const link = createNetworkErrorLink(handler)
  return execute(link, { query: FAKE_QUERY })
}
