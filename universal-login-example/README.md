# Example

## Running example on development environment

### Installing dependencies

To install dependencies and build projects, run the following commands from the **main directory** of the repository.
```sh
yarn
```

### Running example

**Note**: Before running example, you need to have PostgreSQL installed, up and running.

To run example:

```sh
cd universal-login-example
yarn start:dev [hostAddress]
```

with `hostAddress` being your machine address where the Universal Login service will be accessible via HTTP (default is `localhost`, only local browser will work).

### Running example on testnet environment

Before running example app, you need you need to fill up example config file.
```js
  module.exports = Object.freeze({
    jsonRpcUrl: process.env.JSON_RPC_URL,
    relayerUrl: process.env.RELAYER_URL,
    ensAddress: process.env.ENS_ADDRESS,
    ensDomains: [process.env.ENS_DOMAIN_1, process.env.ENS_DOMAIN_2],
    clickerContractAddress: process.env.CLICKER_CONTRACT_ADDRESS,
    tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS
  });
```

To do this, add new file in `universal-login-example` directory and name it `.env`. And then paste there following data:
```
  JSON_RPC_URL='https://ropsten.infura.io'
  RELAYER_URL='https://relayer.universallogin.io'
  ENS_ADDRESS='0x112234455c3a32fd11230c42e7bccd4a84e02010'
  ENS_DOMAIN_1='poppularapp.test'
  ENS_DOMAIN_2='universal-login.test'
  TOKEN_CONTRACT_ADDRESS='0xE5f527f02a688f7227850C890403fa35A9d8C505'
  CLICKER_CONTRACT_ADDRESS='0x7CAa4eBc2DCaB82e44fcb003d04Fc2BCc7d31252'
```
then you can run example, from `universal-login-example` directory:
```
yarn start
```
