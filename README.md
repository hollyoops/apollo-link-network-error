# apollo-link-network-error

An Apollo Link that you can dynamic ignore/change the network error. and you can easy to implement the **offline-first feature** with this link and `cache-and-network` _fetchPolicy_

> Note: As all we know, apollo client provide the `fetchPolicy: 'cache-and-network'`. It will use local data and then try to fetch the network data. However, it errors if the server can't be reached or no network connection

Basically this means your UI's queries will always work if the requested data is available in the local cache and it will always keep the cached data consistent with your server data if it can be reached.

## Install

npm

```shell
npm install --save apollo-link-network-error
```

## Basic Usage

### Setup

```javascript
import { ApolloClient } from 'apollo-client'
import { NetworkErrorLink } from 'apollo-link-network-error'

const onNetworkError = ({ error, operation }) => {
  if ('some_condition_1') {
    // return a new error to replace
    throw error
  }

  if ('some_condition_2') {
    // not return error and will take following obj as response
    return {
      test: ok,
    }
  }

  // do nothing with the network error (still return raw error)
  return null
}

const errorIgnoreLink = new NetworkErrorLink(onNetworkError)
const client = new ApolloClient({
  cache,
  errorIgnoreLink,
})
```

## Offline-first Example

### Setup

```javascript
import { ApolloClient } from 'apollo-client'
import { cacheFirstHandler } from 'apollo-link-network-error'

const cache = new InMemoryCache()
// Create the default interceptor
const errorIgnoreLink = cacheFirstHandler(cache)
const client = new ApolloClient({
  cache,
  errorIgnoreLink,
})
```

_Note: Once set up, you can add the flag in context (i.e. `context: { __skipNetworkError__: true }`)._

### Sending request

```javascript
// - offline-first query
client.query({
  fetchPolicy: 'cache-and-network',
  query: /* Your query here */,
  // Enable error ignore
  context: { __skipNetworkError__: true }
  variables: /* Your variables here */
});

```

### React Apollo

```html
<Query
    fetchPolicy='cache-and-network'
    query={/* Your query here */}
    variables={/* Your variables here */}
    context={{__skipNetworkError__: true }}
  >
    {props.children}
</Query>
```
