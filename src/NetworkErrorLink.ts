import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation,
} from 'apollo-link'

export interface INetworkResponse {
  networkError: any
  operation: Operation
  forward?: NextLink
}

export type ResultData = {
  [key: string]: any
}
type NetworkErrorHandlerResult = ResultData | Promise<ResultData> | null

export type NetworkErrorHandler = (
  error: INetworkResponse
) => NetworkErrorHandlerResult

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

          try {
            const result = this.handler(errorData)
            this.promisifyResult(result)
              .then(data => observer.next({ data }))
              .catch(error => observer.error(error || networkError))
          } catch (e) {
            observer.error(e)
          }
        },
        complete: observer.complete.bind(observer),
      })

      return () => {
        if (subscription) subscription.unsubscribe()
      }
    })
  }

  private promisifyResult(obj: NetworkErrorHandlerResult): Promise<ResultData> {
    if (obj instanceof Promise) {
      return obj
    }

    return new Promise((resolve, reject) =>
      !obj ? reject(null) : resolve(obj)
    )
  }
}
