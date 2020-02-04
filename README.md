# apollo-link-network-error

An Apollo Link that you can dynamic ignore/change the network error. and you can easy to implement the **offline-first feature** with this link and _fetchPolicy_(`network-only` or `cache-and-network`) 

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
import { cacheFirstNetworkErrorLink } from 'apollo-link-network-error'

const cache = new InMemoryCache()
// Create the cache first network error link
const errorIgnoreLink = cacheFirstNetworkErrorLink(cache)
const client = new ApolloClient({
  cache,
  from([errorLink, errorIgnoreLink, httpLink]),
})
```

_Note: Once set up, you can add the flag in context (i.e. `context: { __skipErrorAccordingCache__: true }`)._

### Sending request

> 'network-only' + cacheFirstNetworkErrorLink: This a kind of like the network-first behavior, It try to visit remote data first, if the server can't be reached or no network, it will use the cache data,
if no cache data, it will throw a network error 

```javascript
// - network-first query
// Note: You can not use 'cache-and-network' with client.query. this is the limitation from apollo
client.query({
  fetchPolicy: 'network-only',
  query: /* Your query here */,
  // Enable error ignore
  context: { __skipErrorAccordingCache__: true }
  variables: /* Your variables here */
});

```

> 'cache-and-network' + cacheFirstNetworkErrorLink: This a kind of like the cache-and-network behavior, It try to visit cache data first, then update the data with network. if the server can't be reached or no network, it still try to use cache data. if no cached data, it will throw a network error

### React Apollo

```html
<Query
    fetchPolicy='cache-and-network' //or network-only
    query={/* Your query here */}
    variables={/* Your variables here */}
    context={{__skipErrorAccordingCache__: true }}
  >
    {props.children}
</Query>
```
### React-hook

```javascript
const { data, error } = useQuery(YOUR_QUERY, {
    variables: {/* Your variables here */},
    fetchPolicy: 'cache-and-network', //or network-only
    context: { __skipErrorAccordingCache__: true },
  })
```
