import { ApolloLink, Observable, execute } from 'apollo-link'
import { NetworkErrorLink, NetworkErrorHandler } from '../NetworkErrorLink'
import gql from 'graphql-tag'

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
  const fakeQuery = gql`
    query FakeQuery {
      stub {
        id
      }
    }
  `
  const link = createNetworkErrorLink(handler)
  return execute(link, { query: fakeQuery })
}
