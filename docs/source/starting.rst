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
UniversalLoginSDK has three components. All components are stored in one monorepo `available here <https://github.com/universallogin>`_.
Components are listed below:

- `Contracts <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-contracts>`_ - smart contracts used by UniversalLogin, along with some helper functions
- `Relayer <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-relayer>`_ - HTTP REST server that relays meta-transactions to UniversalLogin smart contracts
- `SDK <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-sdk>`_ - pure javascript API, a thin communication layer that interacts with UniversalLogin ecosystem, via both relayer and Ethereum node.

Additionally, there is one more package in the repository:

- `Example <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-example>`_ - an example app, that demonstrates, used for testing and experimentation.

Dependencies
^^^^^^^^^^^^
Diagram below shows dependencies between components.

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

Quick start
-----------

New project
^^^^^^^^^^^

Installation
  To add sdk to your project using npm type following:
  ::

    npm i universal-login-sdk

  If you are using yarn than type:
  ::

    yarn add universal-login-sdk


Running example
^^^^^^^^^^^^^^^

Prerequisites
  Before running example, make sure you have PostgreSQL installed, up and running.
  You might want to check database configuration in file `knexfile.js <https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/universal-login-example/src/relayer/knexfile.js>`_ and make sure your database is configured correctly.

Installing dependencies
  To install dependencies and build projects run following commands from the main project directory:

  ::

    yarn && yarn build

Running example
  To run example in development mode use following commands:

  ::

    cd universal-login-example
    yarn dev:start [hostAddress]

  Parameters:
    - *hostAddress* (optional) - is host address where the Universal Login relayer will be accessible via HTTP (default is localhost, only works in the local browser).

  This command will start a local development environment, including:
    - start mock development blockchain (ganache)
    - start relayer
    - deploy mock ens system and testing domains (``mylogin.eth``, ``universal-id.eth``, ``popularapp.eth``)
    - deploy ClickToken that can be used for transaction refund
    - setup HTTP server for example app at ``localhost:3000``


