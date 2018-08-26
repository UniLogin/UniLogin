[![Build Status](https://travis-ci.com/EthWorks/EthereumIdentitySDK.svg?branch=master)](https://travis-ci.com/EthWorks/EthereumIdentitySDK)

# Ethereum IdentitySDK

Ethereum Identity SDK is composed of smart contracts and js lib and relayer that help build applications using ERC [#725](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md), [#725](https://github.com/ethereum/EIPs/issues/735), [#1077](https://github.com/ethereum/EIPs/pull/1077) and [#1078](https://github.com/ethereum/EIPs/pull/1078).

This is work in progress. Planned functionality for first release include:
- Creating and managing identities
- Multi-factor authentication
- Universal login
- Ether less transactions via relayer

## Example usage
Getting strated:
```js
import EthereumIdentitySDK from 'EthereumIdentitySDK';
```

To create new identity:
```js
const sdk = new EthereumIdentitySDK();
const privateKey = await sdk.create('alex.ethereum.eth');
```

To use existing identity:
```js
const sdk = new EthereumIdentitySDK('https://relayer.ethworks.io', 'https://etherscan.io/{yourapikey}');
const identity = await sdk.at('alex.ethereum.eth');
```

To add a key to identity:
```js
await identity.addKey(newKey, privateKey);
```

To execute transaction:
```js
const transaction = {
  to: "0x88a5C2c290d9919e46F883EB62F7b8Dd9d0CC45b",
  data: "0x",
  value: "1000000000",
};
const transactionId = await identity.execute(transaction, privateKey);
```

To confirm transaction
```js
await identity.confirm(transactionId)
```

To subscribe to an event:
```js
await identity.subscribe('eventType')
```

Possible event names are: `KeyAdded`, `KeyRemoved`, `ExecutionRequested`, `Executed`, `Approved`.

To unsubscribe to an event:
```js
await identity.unsubscribe('eventType',)
```

## Relayer
To start relayer programmatically:
```js
import Relayer from '../../lib/relayer/relayer';
const privateKey = "0x.....";
const relayer = new Relayer('https://etherscan.io/{yourapikey}', privateKey);
relayer.start();
```

To stop relayer:
```js
relayer.stop();
```

To start relayer from command line:
```sh
npx start-relayer [config-file]
```

Where config file is a JSON file in the following format:
```js
{
  privateKey: '0x123...123',
  port: 3311
}
```

Default port is `3311`, `privateKey` is the only required field.

## Running example on dev environment
Before running example one need to start dev blockchain (from `sdk` directory):
```sh
yarn ganache:start
```

and from new terminal (from `sdk` directory):
```sh
yarn relayer:start
```

then to run example (from `example` directory):
```
yarn start
```

## License

Ethereum Identity SDK  is released under the [MIT License](https://opensource.org/licenses/MIT).
