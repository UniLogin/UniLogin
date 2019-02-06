Example App
===========

Example App is an example application written in React. It is an example use of SDK. With example you can create wallet contract, execute simple operation ``click`` and add keys.


Running example on testnet environment
--------------------------------------

1. Build projects

  Type in the console in main directory following commang

  ::

    yarn 

2. Create ``env`` file

  To run example on testnet create ``.env`` file in ``universal-login-example`` directory and fill it up with following parameters

  ::

    JSON_RPC_URL='https://rinkeby.infura.io'
    RELAYER_URL='https://universal-login-relayer.herokuapp.com'
    ENS_ADDRESS='0xe7410170f87102DF0055eB195163A03B7F2Bff4A'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-id.test'
    TOKEN_CONTRACT_ADDRESS='0x5F81E2afde8297F90b3F9179F8F3eA172f3155A8'
    CLICKER_CONTRACT_ADDRESS='0x01Ed4566E61E3a964059c692e511f441F9B3B8B2'

3. Run example

  Type in the console in ``universal-login-example`` directory following command

  ::

    yarn start

Running example on dev environment
----------------------------------

1. Build projects

  Type in the console in main directory following commang

  ::

    yarn 

2. Run dev:start

  Type in the console in ``universal-login-example`` directory following command

  ::

    yarn dev:start

