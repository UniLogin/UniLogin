# Web3
Web3 is deprecated. Using it is not recommended. Please, use [@unilogin/provider](../universal-login-provider/README.md) instead.

## Using Web3 providers
The easiest way to interact with Universal Login is via web3 providers, that allow interacting with UniLogin contracts via web3js, ethers.js, or similar libraries.

## Installation
To add universal login web3 to project with yarn, type:

```bash
yarn add @unilogin/web3
```

## ULWeb3Provider
ULWeb3Provider allows interacting with UniLogin contracts. Before triggering actions on the blockchain, it will show related dialogs.

Below is example creation of the wallet:
```ts
  const ulWeb3 = new ULWeb3Provider({
    provider: new Web3.providers.HttpProvider(
      'https://kovan.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'
    ),
    relayerUrl: 'https://relayer-kovan.herokuapp.com',
    ensDomains: ['poppularapp.test'],
    applicationInfo: {
      applicationName: 'Kickback',
      logo: 'https://kickback.events/favicon.ico',
      type: 'laptop'
    }
```

Constructor takes one argument - ULWeb3ProviderOptions:
```ts
export interface ULWeb3ProviderOptions {
  provider: Provider; //web3Provider
  relayerUrl: string; //url to ethereum node (as an alternative to proivder)
  ensDomains: string[]; //list of supported domains
  applicationInfo?: ApplicationInfo; // see below
  ...
}
```

Application info allows passing meta-data about an application, that can be later used in a user interface to identify which keys belong to which application and devices

```ts
export interface ApplicationInfo {
  applicationName: string; // Name of the application
  type: string; // 'laptop', 'mobile', 'browser'
  logo: string; //Url to application logo
}
```

## Web3Strategy
Web3Strategy is useful to work with applications that are already working with other existing web3 providers.
It allows delaying user choice of web3 provider (e.g. MetaMask vs Universal Login).
`Web3Strategy` will allow reading from a provider. The first action that requires a wallet will trigger dialog that allows picking web3 provider.

See the example below.

```ts
function setupWeb3(web3) {
  const provider = web3.currentProvider //or however you were creating provider before
  web3.setProvider(
    new Web3Strategy(
      [
        {
          name: 'UniLogin',
          icon: 'UniLogin logo',
          create: () => ulWeb3
        },
        {
          create: () => provider,
          icon: 'Kickback icon',
          name: 'Kickback default provider'
        }
      ],
      provider
    )
  )
}
```


## Example integration
We are working on Example integration with Kickback.
Take a look at following (PR)[https://github.com/UniversalLogin/UniversalKickback/pull/3/files] to see latest working approach.

## Button
Log in with Ethereum button is comming.