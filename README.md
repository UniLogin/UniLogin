[![CircleCI](https://circleci.com/gh/UniversalLogin/UniversalLoginSDK/tree/master.svg?style=svg)](https://circleci.com/gh/UniversalLogin/UniversalLoginSDK/tree/master)

![Universal-Login](./docs/source/static/logo.png)

# Ethereum Universal Login

Universal Login is a design pattern for storing funds and connecting to Ethereum applications, aiming to simplify new users on-boarding.

This repository is a monorepo including sdk, relayer, smart contracts and example. Each public sub-package is independently published to NPM.

Learn [documentation](https://universalloginsdk.readthedocs.io/en/latest/index.html).

## Disclaimer

This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## Technical concepts
Technically Universal Login utilizes four major concepts:
- Personal multi-sig wallet - a smart contract used to store personal funds. A user gets his wallet created in a bearly noticeable manner. The user then gets engaged incrementally to add authorization factors and recovery options.
- Meta-transactions - that give user ability to interact with his wallet from multiple devices easily, without a need to store ether on each of those devices. Meta-transactions, also allow paying for execution with tokens.
- ENS names - naming your wallet with easy-to-remember human-readable name
- Universal login - ability to use the wallet as authorization layer to numerous web applications dapps

## Structure
Packages maintained with this monorepo are listed below.

- [Contracts](https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-contracts) - all contracts used in this project
- [Relayer](https://universalloginsdk.readthedocs.io/en/latest/relayer.html) - node.js server application that allows interacting with blockchain without a wallet
- [SDK](https://universalloginsdk.readthedocs.io/en/latest/sdk.html) - a JS library, that helps to communicate with relayer
- [Example](https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/universal-login-example/README.md) - example application written in React
- OPS - scripts for development and deployment 


## Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/CODE_OF_CONDUCT.md) and [contribution policy](https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/CONTRIBUTION.md).

Before you issue pull request:
* Make sure all tests and linters pass.
* Make sure you have test coverage for any new features.


## Running linting/tests

You can run lint via:

```sh
yarn lint
```

You can run tests:

```sh
yarn test
```

You can ran full clean:
```sh
yarn clean
```

And you can emulate full CI process by:
```sh
yarn clean
yarn
yarn ci
```

## License

Universal Login SDK is released under the [MIT License](https://opensource.org/licenses/MIT).
