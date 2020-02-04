import { DocumentNode } from 'apollo-link'
import { INetworkResponse } from '../NetworkErrorLink'

interface Query<TVariables> {
  query: DocumentNode
  variables?: TVariables
}

interface ReadOptions<TVariables = any> extends Query<TVariables> {
  rootId?: string
  previousResult?: any
}

interface WriteOptions<TResult = any, TVariables = any>
  extends Query<TVariables> {
  dataId: string
  result: TResult
}

export interface ICacheShape {
  read<T, TVariables = any>(query: ReadOptions<TVariables>): T | null
  write<TResult = any, TVariables = any>(
    write: WriteOptions<TResult, TVariables>
  ): void
}

export const cacheFirstHandler = (cache: ICacheShape) => ({
  networkError: error,
  operation,
}: INetworkResponse) => {
  if (!operation.getContext().__skipErrorAccordingCache__) {
    throw error
  }

  const result = cache.read<any>({
    query: operation.query,
    variables: operation.variables,
  })

  if (!result) {
    throw error
  }

  return result
}
