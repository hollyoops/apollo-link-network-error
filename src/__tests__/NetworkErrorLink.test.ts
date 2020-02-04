import { getFakeNetworkErrorLink } from '../testUtils/utils'
import { NetworkErrorHandler, NetworkErrorLink } from '../NetworkErrorLink'

describe('NetworkErrorLink', () => {
  const assertError = (done: jest.DoneCallback) => (
    handler: NetworkErrorHandler,
    error: Error
  ) => {
    getFakeNetworkErrorLink(handler).subscribe({
      error: networkError => {
        expect(networkError.toString()).toEqual(error.toString())
        done()
      },
    })

    jest.runAllTimers()
  }

  const assertNext = (done: jest.DoneCallback) => (
    handler: NetworkErrorHandler,
    customerData: any
  ) => {
    getFakeNetworkErrorLink(handler).subscribe({
      next: data => {
        expect(data).toEqual({ data: customerData })
        done()
      },
    })

    jest.runAllTimers()
  }

  it('should return null when call request and there no next link', () => {
    const handler = () => ({})
    const link = new NetworkErrorLink(handler)
    expect(link.request({} as any, undefined)).toBe(null)
  })

  it('should return customer error when error handler return a customer error', done => {
    const customerError = Error('customer error')
    const handler = () => {
      throw customerError
    }
    assertError(done)(handler, customerError)
  })

  it('should return customer error when error handler return a customer error by async', done => {
    const customerError = Error('customer error')
    const handler = () => Promise.reject(customerError)
    assertError(done)(handler, customerError)
  })

  it('should return response when error handler return an obj', done => {
    const customerData = { user: 'holly' }
    const handler = () => customerData
    assertNext(done)(handler, customerData)
  })

  it('should return response when error handler return an obj by async', done => {
    const customerData = { user: 'holly' }
    const handler = () =>
      new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(customerData)
        }, 300)
        jest.runAllTimers()
      })
    assertNext(done)(handler, customerData)
  })
})
