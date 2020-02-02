import { cacheFirstHandler, ICacheShape } from './handler/cacheFirstHandler'
import { NetworkErrorLink } from './NetworkErrorLink'

const cacheFirstNetworkErrorLink = (cache: ICacheShape): NetworkErrorLink =>
  new NetworkErrorLink(cacheFirstHandler(cache))

export { NetworkErrorLink, cacheFirstNetworkErrorLink }
