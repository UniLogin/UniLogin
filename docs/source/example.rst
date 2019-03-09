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

        Wallets:
          0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff - 0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797
          0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 - 0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74
          0xD1D84F0e28D6fedF03c73151f98dF95139700aa7 - 0x50c8b3fc81e908501c8cd0a60911633acaca1a567d1be8e769c5ae7007b34b23
          0xd59ca627Af68D29C547B91066297a7c469a7bF72 - 0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5
          0xc2FCc7Bcf743153C58Efd44E6E723E9819E9A10A - 0xe217d63f0be63e8d127815c7f26531e649204ab9486b134ec1a0ae9b0fee6bcf
          0x2ad611e02E4F7063F515C8f190E5728719937205 - 0x8101cca52cd2a6d8def002ffa2c606f05e109716522ca2440b2cc84e4d49700b
          0x5e8b3a7e6241CeE1f375924985F9c08706f41d34 - 0x837fd366bc7402b65311de9940de0d6c0ba3125629b8509aebbfb057ebeaaa25
          0xFC6F167a5AB77Fe53C4308a44d6893e8F2E54131 - 0xba35c32f7cbda6a6cedeea5f73ff928d1e41557eddfd457123f6426a43adb1e4
          0xDe41151d0762CB537921c99208c916f1cC7dA04D - 0x71f7818582e55456cb575eea3d0ce408dcf4cbbc3d845e86a7936d2f48f74035
          0x121199e18C70ac458958E8eB0BC97c0Ba0A36979 - 0x03c909455dcef4e1e981a21ffb14c1c51214906ce19e8e7541921b758221b5ae

        Node url (ganache): http://localhost:18545...
              ENS address: 0x67AC97e1088C332cBc7a7a9bAd8a4f7196D5a1Ce
        Registered domains: mylogin.eth, universal-id.eth, popularapp.eth
            Token address: 0x0E2365e86A50377c567E1a62CA473656f0029F1e
              Relayer url: http://localhost:3311
          Clicker address: 0xD3C4A8F56538e07Be4522D20A6410c2c4e4B26a6

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
    RELAYER_URL='https://relayer.universallogin.io'
    ENS_ADDRESS='0xe7410170f87102DF0055eB195163A03B7F2Bff4A'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-id.test'
    TOKEN_CONTRACT_ADDRESS='0x5F81E2afde8297F90b3F9179F8F3eA172f3155A8'
    CLICKER_CONTRACT_ADDRESS='0x01Ed4566E61E3a964059c692e511f441F9B3B8B2'



To run the application in production mode, type in the console in ``universal-login-example`` directory following command:

  ::

    yarn start

You can use the configuration above in your own applications.
