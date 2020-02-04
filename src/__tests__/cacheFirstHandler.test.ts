import { cacheFirstHandler } from '../handler/cacheFirstHandler'
import { NetworkErrorHandler } from '../NetworkErrorLink'
import { FAKE_QUERY } from '../testUtils/utils'

describe('cacheFirstHandler', () => {
  const mockCache = {
    read: jest.fn(),
    write: jest.fn(),
  }
  const networkError = Error('network error')
  let handler: NetworkErrorHandler
  beforeEach(() => {
    handler = cacheFirstHandler(mockCache)
  })

  it('should throw Error if not enable __skipErrorAccordingCache__ flag when have local cache data', () => {
    mockCache.read.mockReturnValue({ user: 'holly' })
    const t = () =>
      handler({
        networkError,
        operation: {
          query: FAKE_QUERY,
          getContext() {
            return {}
          },
        } as any,
      })

    expect(t).toThrowError(networkError)
  })

  it('should return data if enable __skipErrorAccordingCache__ flag when have local cache data', () => {
    const data = { user: 'holly' }
    mockCache.read.mockReturnValue(data)
    const result = handler({
      networkError,
      operation: {
        query: FAKE_QUERY,
        getContext() {
          return {
            __skipErrorAccordingCache__: true,
          }
        },
      } as any,
    })

    expect(result).toEqual(data)
  })

  it('should throw error if enable __skipErrorAccordingCache__ flag when no local cache data', () => {
    mockCache.read.mockReturnValue(null)
    const t = () =>
      handler({
        networkError,
        operation: {
          query: FAKE_QUERY,
          getContext() {
            return {
              __skipErrorAccordingCache__: true,
            }
          },
        } as any,
      })

    expect(t).toThrowError(networkError)
  })
})
