.. _example:

Example App
===========

Example App is a dapp using Universal Login SDK written using React, written for demonstration and testing purposes.
With the example, you can create a wallet contract, execute a simple operation on ``Clicker`` contract and manage keys.

Prerequisites
  Before running the example, make sure you have PostgreSQL installed, up and running.
  You might want to check database configuration in file `knexfile.js <https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/universal-login-example/src/relayer/knexfile.js>`_ and make sure your database is configured correctly.

Installing dependencies
  To install dependencies and build projects run following commands from the main project directory:

  ::

    yarn

Running example on dev environment
----------------------------------

Running example
  To run example in development mode use following commands:

  ::

    cd universal-login-example
    yarn start:dev [hostAddress]

  Parameters:
    - *hostAddress* (optional) - is host address where the Universal Login relayer will be accessible via HTTP (default is localhost, only works in the local browser).

  This command will start a local development environment, including:
    - start mock development blockchain (ganache)
    - deploy mock ens system and testing domains (``mylogin.eth``, ``universal-id.eth``, ``popularapp.eth``)
    - start pre-configured relayer
    - deploy test token that can be used for transaction refund
    - deploy ``Clicker`` contract used by example application
    - setup HTTP server for example app at ``localhost:3000``

  The output of the command should look like this:

  ::

    Ganache up and running on http://localhost:18545...
    Ens deployed to address: 0x67AC97e1088C332cBc7a7a9bAd8a4f7196D5a1Ce
    Token contract address: 0x0E2365e86A50377c567E1a62CA473656f0029F1e
    Database 'universal_login_relayer_development' already exists.
    Migrating database...
    Starting relayer on port 3311...
    Clicker contract address: 0xD3C4A8F56538e07Be4522D20A6410c2c4e4B26a6
    web: $ parcel --no-cache ./src/index.html

    web: Server running at http://localhost:1234

  You can now go to ``http://localhost:1234`` to play with the application.


Running example on testnet environment
--------------------------------------

To configure the example application, you need to set a couple on environmental variables.
A simple way to do that you need to create ``.env`` file.

To use existing testnet relayer create ``.env`` file in ``universal-login-example`` directory and fill it up with following parameters:

  ::

    JSON_RPC_URL='https://rinkeby.infura.io'
    RELAYER_URL='https://relayer.universallogin.io/'
    ENS_ADDRESS='0xe7410170f87102DF0055eB195163A03B7F2Bff4A'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-id.test'
    TOKEN_CONTRACT_ADDRESS='0x5F81E2afde8297F90b3F9179F8F3eA172f3155A8'
    CLICKER_CONTRACT_ADDRESS='0x01Ed4566E61E3a964059c692e511f441F9B3B8B2'



To run the application in production mode, type in the console in ``universal-login-example`` directory following command:

  ::

    yarn start

You can use the configuration above in your own applications.
