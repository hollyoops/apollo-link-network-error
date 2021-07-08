# apollo-link-network-error

An Apollo Link that you can dynamic ignore/change the network error. and you can easy to implement the **Network-first feature**(with `network-only` _fetchPolicy_) and **Offline-first feature** (with `cache-and-network` _fetchPolicy_)

Basically this means your UI's queries will always work if the requested data is available in the local cache and it will always keep the cached data consistent with your server data if it can be reached.

> NOTE: Currently we only tested it on react-native. If there are some issues on browser, just create an issue or make a PR

## Install

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
    // option1: throw a new error to replace
    throw error
  }

  if ('some_condition_2') {
    // option2: not return error and will take following object as response
    return {
      info: somedata,
    }
  }

  return Promise(....) // option3: you can return a promise
}

const errorIgnoreLink = new NetworkErrorLink(onNetworkError)
const client = new ApolloClient({
  cache,
  errorIgnoreLink,
})
```

## Offline solution

### Setup

```javascript
import { ApolloClient, ApolloLink } from '@apollo/client'
import { cacheFirstNetworkErrorLink } from 'apollo-link-network-error'

const cache = new InMemoryCache()
// Create the cache first network error link
const errorIgnoreLink = cacheFirstNetworkErrorLink(cache)
const link = ApolloLink.from([errorLink, errorIgnoreLink, httpLink])
const client = new ApolloClient({
  cache,
  link,
})

persistCache({ cache, storage: AsyncStorage })
```

_Note: Once set up, you can add the flag in context (i.e. `context: { __skipErrorAccordingCache__: true }`)._

### Network-first Example

> NOTE: As all we know, apollo client provide the `fetchPolicy: 'network-only'`, this policy will try visit remote data, **if success, it will store the data to cache**

**`'network-only' + cacheFirstNetworkErrorLink`**: This a kind of like the network-first behavior. it will try to visit network data first. **if the server can't be reached or no network**, it will use the cache data. if no cache data, it will throw a network error

```javascript
// Note: You can not use 'cache-and-network' on client.query(). this is the limitation from apollo.
client.query({
  fetchPolicy: 'network-only',
  query: /* Your query here */,
  // Enable error ignore
  context: { __skipErrorAccordingCache__: true }
  variables: /* Your variables here */
});

```

#### React-hook

```javascript
const { data, error } = useQuery(YOUR_QUERY, {
  variables: YOUR_VARIBLES,
  fetchPolicy: 'network-only',
  context: { __skipErrorAccordingCache__: true },
})
```

### Offline-first Example

> NOTE: As all we know, apollo client provide the `fetchPolicy: 'cache-and-network'`. It will use local data and then try to fetch the network data. However, it errors if the server can't be reached or no network connection

**`'cache-and-network' + cacheFirstNetworkErrorLink`**: **if the server can't be reached or no network**, it still try to use cache data. if no cached data, it will throw a network error.

#### React-Apollo

```javascript
<Query
  query=YOUR_QUERY
  variables=YOUR_VARIBLES
  fetchPolicy="cache-and-network"
  context={{__skipErrorAccordingCache__: true}}
>
  {props.children}
</Query >
```

#### React-hook

```javascript
const { data, error } = useQuery(YOUR_QUERY, {
  variables: YOUR_VARIBLES,
  fetchPolicy: 'cache-and-network',
  context: { __skipErrorAccordingCache__: true },
})
```
