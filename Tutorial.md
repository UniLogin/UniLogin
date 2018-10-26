# Tutorial

## Downloading repository

```sh
git clone git@github.com:EthWorks/UniversalLoginSDK.git
yarn
yarn build
```

```sh
cd universal-login-example/
yarn dev start
```

## Running example and creating an identity

This will do a number of things for you:
* runs local ganache on localhost:18545
* deploy a couple of example ens domains
* runs relayer on
* runs web application on localhost:1234


You can now go to localhost:1234 and create your identity using `mylogin.eth` domain.


When creating identity it is given balance in ClickToken that you can spend to pay for transactions.

## Creating own project

Navigate to `universal-login-boilerplate` and start playing.
The project has already a number of things set up:
* ES6 and React compilation
* Dependency on universal-login-sdk
* An example view in react that allows to connect to exiting identity

Build app and start web server with:
```sh
yarn
yarn start
```

Play around!