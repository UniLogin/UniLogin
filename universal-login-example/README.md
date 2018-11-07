## Example

### Running example on dev environment (quick option)

To install dependencies and build projects, run the following commands from the main directory of the repository.

```sh
yarn
```

To run example:

```sh
cd universal-login-example
yarn dev:start [hostAddress]
```

with `hostAddress` being your machine address where the Universal Login service will be accessible via HTTP (default is `localhost`, only local browser will work).

### Running example on dev environment (manual option, deprecated, will be removed soon)

Before running the example, first you must start a mock blockchain. From the `universal-login-relayer` directory run the following command:

```sh
yarn ganache:start
```

then deploy ens contracts and start relayer, from new console in the `universal-login-relayer` directory type:

```sh
yarn ens:deploy
yarn relayer:start
```

then deploy contracts for the example application and run the application (from new console in the `universal-login-example` directory):

```
yarn contracts:deploy
yarn start
```