## SDK

### Getting Started

To create a SDK instance:

```js
import EthereumIdentitySDK from 'EthereumIdentitySDK';
const sdk = new EthereumIdentitySDK(
  'https://relayer.ethworks.io',
  'https://etherscan.io/{yourapikey}'
);
```

To create a new identity:

```js
const [firstPrivateKey, contractAddress] = await sdk.create(
  'alex.ethereum.eth'
);
```

`create` function takes a single parameter:

- ENS name. The name needs to be a non-existing subdomain in ENS domain supported by relayer.

The function will return a pair:

- `privateKey` - a private key that should be stored on given device as securely as possible
- `contractAddress` - address of new identity contract

To get address of existing identity:

```js
const contractAddress = await sdk.identityExist('alex.ethereum.eth');
```

The call will return the address of the identity contract for later use.


### Transaction execution

To execute a message/transaction:

```js
const message = {
  to: '0x88a5C2c290d9919e46F883EB62F7b8Dd9d0CC45b',
  data: '0x',
  value: '1000000000',
  gasToken: '0xEB62F7b8Dd9d0CC45b88a5C2c290d9919e46F883EB',
  gasPrice: 11000000000,
  gasLimit: 1000000
};
const transactionId = await sdk.execute(contractAddress, message, privateKey);
```

The function takes six arguments:

- `contractAddress` - address of identity that requests execution
- `message` - a message, in the same format as an ethereum transaction, to be executed by the relayer
- `privateKey` - a private key to be used to sign the transaction, the corresponding public key address needs to be connected to the identity
- `gasToken` - address of token to refund relayer
- `gasPrice` - price of gas
- `gasLimit` - limit of gas

The function will return one result:

- `transactionId` (also called `nonce`) - an id of execution, might be used to confirm excution


### Events

To subscribe to an event:

```js
const callback(event) = {};
await sdk.subscribe('eventType', contractAddress, callback)
```

Possible event names are: `KeyAdded`, `KeyRemoved`, `AuthorisationsChanged`.

To unsubscribe to an event:

```js
await sdk.unsubscribe('eventType', contractAddress, callback);
```

### Key management

To add a key:

```js
const transactionId = await sdk.addKey(
  contractAddress,
  publicKey,
  privateKey,
  paymentOptions
);
```

To remove a key:

```js
const transactionId = await sdk.removeKey(
  contractAddress,
  publicKey,
  privateKey,
  paymentOptions
);
```

In each case paymentOptions are:

```js
const paymentOptions = {
  gasToken: '0x123456765432345654321',
  gasPrice: 11000000000,
  gasLimit: 1000000
}
```
- `gasToken` - address of token to refund relayer
- `gasPrice` - price of gas
- `gasLimit` - limit of gas


Generate and request a new key to be added to an existing identity:

```js
const [privateKey, contractAddress] = await sdk.connect(contractAddress);
```

This function will generate a new private key and send a request to relayer to add a key to identity. The request needs to be confirmed from public key connected to identity at hand.

`connect` function takes one parameter:

- `contractAddress` - address of identity to connect

and returns:

- `privateKey` - newly generated private key to be stored on a local device in the most secure way possible


The function will throw:

- `InvalidIdentity` - if Identity does not exist (i.e. ENS Name does not resolve or resolves to a non-identity address)


Confirmation connection (when request event occurs):

```js
await identity.subscribe('AuthorisationsChanged', event => {
  identity.addKey(event.key, firstPrivateKey);
});
```
