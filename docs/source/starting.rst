Getting started
===============


Overview
--------

Technical concepts
^^^^^^^^^^^^^^^^^^

Technically Universal Login utilizes four major concepts:

- **Personal multi-sig wallet** - a smart contract used to store personal funds. A user gets his wallet created in a barely noticeable manner. The user then gets engaged incrementally to add authorization factors and recovery options.
- **Meta-transactions** - that gives user ability to interact with the smart contract from multiple devices easily, without a need to store ether on each of those devices. Meta-transactions enable payments for execution with tokens.
- **ENS names** - naming your wallet with easy-to-remember human-readable name
- **Universal login** - wallet name can be used to log in to dapps, web, and native applications

Components
^^^^^^^^^^
Universal Login has three components. All components are stored in one monorepo `available here <https://github.com/universallogin>`_.
Components are listed below:

- `Contracts <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-contracts>`_ - smart contracts used by Universal Login, along with some helper functions
- `Relayer <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-relayer>`_ - HTTP REST server that relays meta-transactions to Universal Login smart contracts
- `SDK <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-sdk>`_ - javascript API, a thin communication layer that interacts with the Universal Login ecosystem, via both relayer and Ethereum node.

Additionally, there is one more package in the repository:

- `Example <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-example>`_ - an example app, that demonstrates, used for testing and experimentation.

Dependencies
^^^^^^^^^^^^
The diagram below shows dependencies between components.

.. image:: ../modeling/subsystems.png


The external interfaces present in the Universal Login system are identified by the lollipop use symbol:

<<IF-6>> RELAYER HTTP JSON IF
  this interface defines an off-chain remote API for ERC #1077 and #1078
<<IF-9>> ETH JSON-RPC IF
  this interface is the Ethereum JSON-RPC API for the on-chain execution

The internal interfaces defined within the Universal Login system are identified by the arrow use symbol. The main ones are:

<<IF-2>> UL SDK IF
  the JS applications using Universal Login shall be based on this library interface to conveniently attach to the Relayer subsystem and route their meta transactions
<<IF-4>> ERC1077 SIG IF
  this interface is a message hash and signature JS facility API for ERC #1077
<<IF-5>> ERC1077 IF / ERC1078 IF
  this interface is made up of ERC #1077 and #1078 smart contracts ABI

Quickstart
-----------

New project
^^^^^^^^^^^

Installation
  To add SDK to your project using npm type following:
  ::

    npm i universal-login-sdk

  If you are using yarn than type:
  ::

    yarn add universal-login-sdk


Development environment
^^^^^^^^^^^^^^^^^^^^^^^
Summary
  Development environment helps quickly develop and test applications using universal login.
  The script that starts development environment can be run from ``universal-login-ops`` project.
  The script does a bunch of helpful things:

  - creates a mock blockchain (ganache)
  - deploys mock ENS
  - registers three testing ENS domains: ``mylogin.eth``, ``universal-id.eth``, ``popularapp.eth``
  - deploys example ERC20 Token that can be used to pay for transactions
  - creates a database for a relayer
  - starts local relayer

Prerequisites
  Before running the development environment, make sure you have **PostgreSQL** installed, up and running.
  You might want to check database configuration in file `knexfile.js <https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/universal-login-example/src/relayer/knexfile.js>`_ and make sure your database is configured correctly.

Installation
  To use development environment, you need to install ``universal-login-ops`` as dev dependency to your project.

  With npm:

    ::

      npm install universal-login-ops --save-dev

  With yarn:

    ::

      yarn add --dev universal-login-ops

Adding a script
  The simplest way to use development environment is to add a script to ``package.json`` file:

  ::

    ...
    "scripts": {
      ...
      "start:dev": "universal-login start:dev"
    }



Running development environment
  To start development environment type in your console:

  ::

    yarn start:dev

Which will start the development environment. The output should look somewhat like this:

  ::

    Ganache up and running on http://localhost:18545...
    Ens deployed to address: 0x67AC97e1088C332cBc7a7a9bAd8a4f7196D5a1Ce
    Token contract address: 0x0E2365e86A50377c567E1a62CA473656f0029F1e
    Database 'universal_login_relayer_development' already exists.
    Migrating database...
    Starting relayer on port 3311...


Troubleshooting
  ``web3.js`` is derivative dependence of ``universal-login-ops``.
  Unfortunately ``web3.js`` is unstable.
  If you have problems with installation or running the script, we recommend that you add following section to your ``package.json`` file.

  ::

    "resolutions": {
      "web3": "1.0.0-beta.35"
    }



Using SDK
-------------------------

Creating a wallet contract
^^^^^^^^^^^^^^^^^^^^^^^^^^

To start using SDK you will need to create SDK instance and deploy a wallet contract.
Below is a snippet doing precisely that for the development environment.

::

  import UniversalLoginSDK from 'universal-login-sdk';

  const universalLoginSDK = new UniversalLoginSDK('http://localhost:3311', 'http://localhost:18545');
  const [privateKey, contractAddress] = await sdk.create('myname.mylogin.eth');


The first argument of ``UniversalLoginSDK`` constructor is relayer address, second is Ethereum node address.

Sending transaction
^^^^^^^^^^^^^^^^^^^
Once you have contract wallet deployed you can execute a transaction:

::

  const message = {
    from: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
    to: '0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A',
    data: '0x0',
    value: '500000000000000000',
    gasToken: '0x9f2990f93694B496F5EAc5822a45f9c642aaDB73',
    gasPrice: 1000000000,
    gasLimit: 1000000
  };

  await sdk.execute(message, privateKey);


Note: ``from`` field in this case is contract address.

Most fields of a message are analogous to normal Ethereum transaction, except for ``gasToken``,
which allows specifying token in which transaction cost will be refunded.

The token need to be supported by relayer.
Wallet needs to have enough token balance to refund transaction.

A detailed explanation of each method can be found in subsections of :ref:`SDK documentation<sdk>`: :ref:`creating SDK<sdk_create>`, :ref:`creating wallet contract<sdk_create_contract>` and :ref:`execute<sdk_execute>`.

Connecting SDK to testnet
-------------------------

To connect SDK to the Rinkeby testnet and the test relayer:

::

  import UniversalLoginSDK from 'universal-login-sdk';
  import ethers from 'ethers';


  const relayerUrl = 'https://relayer.universallogin.io';
  const jsonRpcUrl = 'https://rinkeby.infura.io';

  const universalLoginSDK = new UniversalLoginSDK(relayerUrl, jsonRpcUrl);

You can find example usage of SDK :ref:`here <sdk-example-testnet>`



What's next?
------------
Go to:

- :ref:`SDK documentation<sdk>` - if you would like to build an application using Universal Login
- :ref:`Relayer documentation<relayer>` - if you would like to set up your own relayer
- :ref:`Example documentation<example>` - if you would like to play with the example application
