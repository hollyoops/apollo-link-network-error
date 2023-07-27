import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation,
} from '@apollo/client/core'

export interface INetworkResponse {
  networkError: any
  operation: Operation
  forward?: NextLink
}

export type ResultData = {
  [key: string]: any
}

export type NetworkErrorHandler = (
  error: INetworkResponse
) => ResultData | Promise<ResultData>

export class NetworkErrorLink extends ApolloLink {
  private handler: NetworkErrorHandler
  constructor(errorHandler: NetworkErrorHandler) {
    super()
    this.handler = errorHandler
  }

  request(
    operation: Operation,
    forward?: NextLink
  ): Observable<FetchResult> | null {
    if (!forward) return null

    return new Observable(observer => {
      const subscription = forward(operation).subscribe({
        next: result => observer.next(result),
        error: networkError => {
          const errorData = {
            networkError,
            operation,
            forward,
          }

          Promise.resolve(errorData)
            .then(this.handler)
            .then(data => {
              observer.next({ data })
              observer.complete()
            })
            .catch(error => observer.error(error || networkError))
        },
        complete: observer.complete.bind(observer),
      })

      return () => {
        if (subscription) subscription.unsubscribe()
      }
    })
  }
}
