import { cacheFirstHandler } from '../handler/cacheFirstHandler'
import { NetworkErrorHandler } from '../NetworkErrorLink'
import { FAKE_QUERY } from '../testUtils/utils'

describe('cacheFirstHandler', () => {
  const mockCache = {
    read: jest.fn(),
    write: jest.fn(),
  }
  let handler: NetworkErrorHandler
  beforeEach(() => {
    handler = cacheFirstHandler(mockCache)
  })

  it('should return null if not enable __skipErrorAccordingCache__ flag when have local cache data', () => {
    mockCache.read.mockReturnValue({ user: 'holly' })
    const result = handler({
      networkError: Error('error'),
      operation: {
        query: FAKE_QUERY,
        getContext() {
          return {}
        },
      } as any,
    })

    expect(result).toEqual(null)
  })

  it('should return data if enable __skipErrorAccordingCache__ flag when have local cache data', () => {
    const data = { user: 'holly' }
    mockCache.read.mockReturnValue(data)
    const result = handler({
      networkError: Error('error'),
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

  it('should return null if enable __skipErrorAccordingCache__ flag when no local cache data', () => {
    mockCache.read.mockReturnValue(null)
    const result = handler({
      networkError: Error('error'),
      operation: {
        query: FAKE_QUERY,
        getContext() {
          return {
            __skipErrorAccordingCache__: true,
          }
        },
      } as any,
    })

    expect(result).toEqual(null)
  })
})
