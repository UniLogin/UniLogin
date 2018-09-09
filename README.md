[![Build Status](https://travis-ci.com/EthWorks/EthereumIdentitySDK.svg?branch=master)](https://travis-ci.com/EthWorks/EthereumIdentitySDK)

# Ethereum IdentitySDK

Ethereum Identity SDK is composed of smart contracts and js lib and relayer that help build applications using ERC [#725](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md), [#725](https://github.com/ethereum/EIPs/issues/735), [#1077](https://github.com/ethereum/EIPs/pull/1077) and [#1078](https://github.com/ethereum/EIPs/pull/1078).

This is work in progress. Planned functionality for first release include:
- Creating and managing identities
- Multi-factor authentication
- Universal login
- Ether less transactions via relayer

## JS SDK, example usage:

### Getting strated

To create identity:
```js
import EthereumIdentitySDK from 'EthereumIdentitySDK';
const sdk = new EthereumIdentitySDK('https://relayer.ethworks.io', 'https://etherscan.io/{yourapikey}');
```

To create new identity:
```js
const [privateKey, identityAddress]  = await sdk.create('alex.ethereum.eth');
```

To reconnect to existing identity, with a private key:
```js
const identityAddress = await sdk.at('alex.ethereum.eth', privateKey);
```

### Transaction execution 

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
await identity.confirm(transactionId, privateKey)
```

### Events

To subscribe to an event:
```js
const callback(event) = {};
await identity.subscribe('eventType', callback)
```

Possible event names are: `KeyAdded`, `KeyRemoved`, `ExecutionRequested`, `Executed`, `Approved`.

To unsubscribe to an event:
```js
await identity.unsubscribe('eventType', callback)
```

### Key management
Generate and request a new key to be added to an existing identity:
```js 
const [privateKey, identityAddress]  = await sdk.connect('alex.ethereum.eth');
```

Confirmation of adding a key
```js
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
Start with building all three projects (`relayer`, `sdk` and `example`). From the main project directory run:
```sh
./script/build.sh
```

Before running example one need to start mock blockchain. Run from `relayer` directory following command:
```sh
yarn ganache:start
```

than deploy ens contracts and start relayer, from new console in `relayer` directory type:
```sh
yarn ens:deploy
yarn relayer:start
```

than deploy contracts for example application and run application (from new console in `example` directory):
```
yarn contracts:deploy
yarn start
```

## License

Ethereum Identity SDK  is released under the [MIT License](https://opensource.org/licenses/MIT).
