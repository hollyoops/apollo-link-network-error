import { NetworkErrorLink } from './NetworkErrorLink'
import { ICacheShape, cacheFirstHandler } from './handler/cacheFirstHandler'

const cacheFirstNetworkErrorLink = (cache: ICacheShape): NetworkErrorLink =>
  new NetworkErrorLink(cacheFirstHandler(cache))

export { NetworkErrorLink, cacheFirstNetworkErrorLink }
