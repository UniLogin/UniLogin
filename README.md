[![CircleCI](https://circleci.com/gh/UniversalLogin/UniversalLoginSDK/tree/master.svg?style=svg)](https://circleci.com/gh/UniversalLogin/UniversalLoginSDK/tree/master)

![Universal-Login](./docs/source/static/logo.png)

# Ethereum Universal Login

Universal Login is a tool for storing funds and connecting to Ethereum applications, aiming to simplify on-boarding of new users.

This repository is a monorepo including the sdk, relayer, smart contracts and examples. Each public sub-package is independently published to NPM.

## Documentation

Documentation is available at [universalloginsdk.readthedocs.io](https://universalloginsdk.readthedocs.io/en/latest/index.html)

## Disclaimer

This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## Technical concepts
Technically Universal Login utilizes four major concepts:
- Personal multi-sig wallet - a smart contract used to store personal funds. A user gets his wallet created in a barely noticeable manner. The user then incrementally adds authorization factors and recovery options.
- Meta-transactions - these give users the ability to interact with their wallets from multiple devices easily, without a need to store ether on each of those devices. Meta-transactions, also allow one to pay for execution with tokens.
- ENS names - naming your wallet with easy-to-remember human-readable names.
- Universal login - ability to use the wallet as an authorization layer to numerous web applications/dapps.

## Structure
Packages maintained with this monorepo are listed below.

- [Contracts](https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-contracts) - all contracts used in this project
- [Relayer](https://universalloginsdk.readthedocs.io/en/latest/relayer.html) - node.js server application that allows interacting with blockchain without a wallet
- [SDK](https://universalloginsdk.readthedocs.io/en/latest/sdk.html) - a JS library, that helps to communicate with relayer
- OPS - scripts for development and deployment
- React - library of React components
- Web3 - web3 provider connected allowing to use Universal Login without the need for modifying existing applications
- Wallet - Jarvis web wallet that used Universal Login
- Commons - standard functions and data structures used throughout the projects

## Testing environment:

### Ropsten:
- Domains: `poppularapp.test`, `my-login.test`, `universal-login.test`
- Relayer url: `https://relayer.universallogin.io`
- Jarvis Wallet (web wallet): [wallet.universallogin.io](https://wallet.universallogin.io)

### Kovan:
- Domain: `poppularapp.test`
- Relayer url: `https://relayer-kovan.universallogin.io`


### Rinkeby:
- Domain: `poppularapp.test`
- Relayer url: `https://relayer-rinkeby.universallogin.io`

### Mainnet (test environment):
- Domain: `unitest.eth`
- Relayer url: `https://relayer-mainnet.universallogin.io`


## Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/CODE_OF_CONDUCT.md) and [contribution policy](https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/CONTRIBUTION.md).

Before you issue pull request:
* Create an issue and discuss with us to see if feature fits the project
* For bigger PRs - setup a pair programing session with us :)
* Split big PRs into multiple smaller PRs
* Make sure all tests and linters pass.
* Make sure you have test coverage for any new features.


## Building, running, linting & tests

To install dependencies:

```sh
yarn install
```

To build all projects:

```sh
yarn build
```

Running run tests for all projects:

```sh
yarn test
```

Running linter for all projects:

```sh
yarn lint
```

To clean the project:
```sh
yarn clean
```

You can run all of above scripts (`install`, `build`, `test`, `lint`, `clean`) from individual project directories.

To emulate the full CI process:
```sh
yarn ci
```

## Building documentation:
```sh
cd docs
make html
```

Documentation will be compiled to `docs/build/html`.

## License

Universal Login SDK is released under the [MIT License](https://opensource.org/licenses/MIT).
