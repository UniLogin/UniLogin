[![Build Status](https://travis-ci.org/UniversalLogin/UniversalLoginSDK.svg?branch=master)](https://travis-ci.org/UniversalLogin/UniversalLoginSDK)

# Ethereum UniversalLoginSDK

Ethereum UniversalLoginSDK is composed of smart contracts, a js lib, and a relayer that help build applications using ERC [#725](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md), [#735](https://github.com/ethereum/EIPs/issues/735), [#1077](https://github.com/ethereum/EIPs/pull/1077) and [#1078](https://github.com/ethereum/EIPs/pull/1078).

This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.
Planned functionality for first release include:

- Creating and managing identities
- Multi-factor authentication
- Universal login
- Ether less transactions via relayer

### Structure
This repository is organised as monorepo.

- [Contracts](https://github.com/EthWorks/UniversalLoginSDK/tree/master/universal-login-contracts) - all contracts used in this project
- [Relayer](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/README.md) - allows to interact with blockchain
- [SDK](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-sdk/README.md) - easy way to communicate with relayer by http protocol
- [Example](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-example/README.md) - example app, which shows how to use SDK

You can find below the diagram showing the internal dependencies among the Universal Login subsystems and the relevant external dependencies

![Diagrams](./modeling/subsystems.png)

The *external* interfaces present in the Universal Login system are identified by the *lollipop* use symbol:

- RELAYER HTTP+JSON IF: this interface defines an off-chain remote API for ERC [#1077](https://github.com/ethereum/EIPs/pull/1077) and [#1078](https://github.com/ethereum/EIPs/pull/1078)
- ETH HTTP+JSON IF: this interface is the Ethereum JSON-RPC API for the on-chain execution

The *internal* interfaces defined within the Universal Login system are identified by the *arrow* use symbol. The main ones are:

- UL SDK IF: the JS applications using Universal Login shall be based on this library interface to conveniently attach to the [Relayer](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/README.md) subsystem and route their meta transactions
- ERC1077 SIG IF: this interface is a message hash and signature JS facility API for ERC [#1077](https://github.com/ethereum/EIPs/pull/1077)
- ERC1077 IF / ERC1078 IF: this interface is made up of ERC [#1077](https://github.com/ethereum/EIPs/pull/1077) and [#1078](https://github.com/ethereum/EIPs/pull/1078) smart contracts ABI


## Quick start

## Hacking
To start hacking around go to [tutorial](https://github.com/EthWorks/UniversalLoginSDK/blob/master/Tutorial.md).
To just see example in action follow the next section.

## Quick example start

To install dependencies and build projects run following commands from the main project directory:

```sh
yarn && yarn build
```

To run example:

```sh
cd universal-login-example
yarn dev:start [hostAddress]
```

with `hostAddress` being your machine address where the Universal Login service will be accessible via HTTP (default is `localhost`, only local browser will work).

[manual option](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-example/README.md)


## Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](https://github.com/EthWorks/UniversalLoginSDK/blob/master/CODE_OF_CONDUCT.md) and [contribution policy](https://github.com/EthWorks/UniversalLoginSDK/blob/master/CONTRIBUTION.md).

Before you issue pull request:
* Make sure all tests and linters pass.
* Make sure you have test coverage for any new features.


## Running linting/tests

You can run lint via:

```sh
./script/lint.sh
```

You can run tests:

```sh
./scripts/test.sh
```

You can ran full clean:
```sh
./scripts/clean.sh
```

And you can emulate full CI process by:
```sh
yarn
./scripts/travis.sh
```

## License

Universal Login SDK is released under the [MIT License](https://opensource.org/licenses/MIT).
