.. _relayer:

Relayer
=======

A relayer is a RESTful JSON API server written in node.js and express.js that allows interacting with a wallet contract using meta-transactions. The relayer gets a signed message and propagates it to the network. It pays for transactions and gets the refund from contracts.

Below are the instructions on how to run the relayer.

If you would like to use your own domain, jump to the section :ref:`ENS registration<ens-registration>`.


Starting a relayer
------------------


Prerequisites
^^^^^^^^^^^^^

**Database**

To run a relayer in a development mode and to run tests you need to have Postgres installed and running.
You also need to have `universal_login_relayer_development` database created.

You can do it in your favorite database UI, or from `psql`:

  ::

    psql
    > create database universal_login_relayer_development;
    > \q


**Factory contract**

To run a relayer you also need to deploy your own factory contract, with the same wallet that the relayer will have. To do that you will need a wallet master contract address (you can deploy your own or use ours). To deploy the factory contract run:

  ::

    universal-login deploy:factory [walletMasterAddress] --privateKey 'YOUR_PRIVATE_KEY' --nodeUrl 'JSON-RPC URL'


Example
  ::

    universal-login deploy:factory 0xfb152D3b3bB7330aA52b2504BF5ed1f376B1C189 --privateKey 'YOUR_PRIVATE_KEY' --nodeUrl https://ropsten.infura.io




.. _from-command-line:

From command line
^^^^^^^^^^^^^^^^^

To start a relayer from the command line, clone `UniversalLoginSDK <https://github.com/UniversalLogin/UniversalLoginSDK>`_ github repository and follow steps:

**1. Setup environment**

Create ``.env`` file in ``/universal-login-relayer`` directory and fill up .env file with parameters:

  - **JSON_RPC_URL** : string - JSON-RPC URL of an Ethereum node
  - **PORT** : number - a relayer endpoint
  - **PRIVATE_KEY** : string - a private key of a relayer wallet
  - **ENS_ADDRESS** : string - an address of an ENS contract
  - **ENS_DOMAIN** : string - a name of a domain
  - **WALLET_MASTER_ADDRESS** : string - WalletMaster contract address
  - **FACTORY_ADDRESS** : string - Factory contract address

  example .env file

  .. code-block:: javascript

    JSON_RPC_URL='https://ropsten.infura.io'
    PORT=3311
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0x112234455c3a32fd11230c42e7bccd4a84e02010'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-login.test'
    ENS_DOMAIN_3='universal-login.test'
    WALLET_MASTER_ADDRESS='0xfb152D3b3bB7330aA52b2504BF5ed1f376B1C189'
    FACTORY_ADDRESS='0xE316A2134F6c2BE3eeFdAde5518ce3F685af27E7'


**2. Run relayer**

Run the following command from ``universal-login-relayer`` directory

  ::

    yarn relayer:start
