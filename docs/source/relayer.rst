.. _relayer:

Relayer
=======

Relayer is a RESTful JSON API server written in node.js and express.js, that allows interacting with wallet contract using meta-transactions. Relayer gets signed message and propagates it to the network. It pays for transactions and gets the refund from contracts.

Below are the instructions how to run relayer.

If you would like to use your own domain, jump to the section :ref:`ENS registration<ens-registration>`.
To learn how to build custom relayer jump to :ref:`Custom relayer<custom-relayer>`.


Starting relayer
----------------


Prerequisites
^^^^^^^^^^^^^

To run relayer in development mode and to run tests you need to have Postgres installed and running.
You also need to have `universal_login_relayer_development` database created.

You can do it in your favorite database UI, or from `psql`:

  ::

    psql
    > create database universal_login_relayer_development;
    > \q



There are two ways to setup relayer :ref:`from command line<from-command-line>` and :ref:`programmatically<programmatically>`.


.. _from-command-line:

From command line
^^^^^^^^^^^^^^^^^

To start relayer from command line, clone `UniversalLoginSDK <https://github.com/UniversalLogin/UniversalLoginSDK>`_ github repository and follow steps:

**1. Setup environment**

Create ``.env`` file in ``/universal-login-relayer`` directory and fill up .env file with parameters:

  - **JSON_RPC_URL** : string - JSON-RPC URL of an Ethereum node
  - **PORT** : number - relayer endpoint
  - **PRIVATE_KEY** : string - private key of relayer wallet
  - **ENS_ADDRESS** : string - address of ENS
  - **ENS_DOMAIN** : string - name of domain
  - **WALLET_MASTER_ADDRESS** : string - WalletMaster contract address

  example .env file

  .. code-block:: javascript

    JSON_RPC_URL='https://ropsten.infura.io'
    PORT=3311
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0x112234455c3a32fd11230c42e7bccd4a84e02010'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-login.test'
    ENS_DOMAIN_3='universal-login.test'
    WALLET_MASTER_ADDRESS='0x413a8425F38AA84DfE847F8097be03369e8164d5'

**2. Run relayer**

Run following command from ``universal-login-relayer`` directory

  ::

    yarn relayer:start

.. _programmatically:

Programmatically
^^^^^^^^^^^^^^^^

To run relayer from your application you will need to create a relayer instance. Relayer constructor documentation below.

**new Relayer(config, provider)**

  Parameters:
    - **config** : object - specific config parameters, includes:

      - **jsonRpcUrl** : string - JSON-RPC URL of an Ethereum node
      - **port** : number - relayer endpoint
      - **privateKey** : string - private key of relayer wallet
      - **ensAddress** : string - address of ENS
      - **ensRegistrars** : array of strings - possible domains
      - **walletMasterAddress** : string - address of WalletMaster contract
    - **provider** : object (optional) - instance of provider of an Ethereum node
  Returns:
    Relayer instance
  Example
    ::

      import Relayer from 'unviersal-login-relayer';

      const config = {
        jsonRpcUrl: 'https://ropsten.infura.io',
        port: 3311,
        privateKey: 'YOUR_PRIVATE_KEY',
        chainSpec: {
          ensAddress: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
          chainId: 0
        },
        ensRegistrars: [
          'poppularapp.test',
          'my-id.test',
          'my-super-domain.test'
        ],
        walletMasterAddress: '0x413a8425F38AA84DfE847F8097be03369e8164d5'
      };

      const relayer = new Relayer(config);
      relayer.start();


Example: connecting to testnet
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  config.js file

  .. code-block:: javascript

    const config = {
      jsonRpcUrl: process.env.JSON_RPC_URL,
      port: process.env.PORT,
      privateKey: process.env.PRIVATE_KEY,
      chainSpec: {
        ensAddress: process.env.ENS_ADDRESS,
        chainId: 0
      },
      ensRegistrars: [
        process.env.ENS_DOMAIN_1,
        process.env.ENS_DOMAIN_2,
        process.env.ENS_DOMAIN_3
      ],
      walletMasterAddress: process.env.WALLET_MASTER_ADDRESS
    }

  .env file

  .. code-block:: javascript

    JSON_RPC_URL='https://ropsten.infura.io'
    PORT=3311
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0x112234455c3a32fd11230c42e7bccd4a84e02010'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-login.test'
    ENS_DOMAIN_3='universal-login.test'
    WALLET_MASTER_ADDRESS='0x413a8425F38AA84DfE847F8097be03369e8164d5'


.. _custom-relayer:

Custom relayer
--------------

You can subclass relayer to create custom behaviot, e.g. a relayer that grants ether or tokens to a newly created wallet contract.

After every operations on contract, there is emitted an event. You can add listeners to this events and transfer funds for every operation.

Possible events:
  - **created** - emitted on new contract creation
  - **added** - emitted on add new key to manage contract
  - **keysAdded** - emitted on add multiple keys to manage contract

`Note:` Events are emitted right after send transaction, not when transaction is mined. You need to wait until it is mined (e.g. use waitToBeMined function).

Event returns transaction detalis as transaction hash or gasPrice.

**this.hooks.addListener(eventType, callback)**

  subscribes an event.

  Parameters:
    - **eventType** : string - type of event, possible event types: ``created``, ``added`` and  ``keysAdded``
    - **callback**

  Returns:
    event listener

  In this example, we create ether granting relayer, that gives tokens to wallet contract for creation, adding key and adding keys.

  ::

    import ethers from 'ethers';
    import {waitToBeMined} from '@universal-login/commons';

    class EtherGrantingRelayer extends Relayer {
      constructor(config, provider = '') {
        super(config, provider);
        this.addHooks();
      }

      addHooks() {
        this.hooks.addListener('created', async (transaction) => {
          const receipt = await waitToBeMined(this.provider, transaction.hash);
          if (receipt.status) {
            this.wallet.sendTransaction({
              to: receipt.contractAddress,
              value: ethers.utils.parseEther('0.01')
            });
          }
        });

        this.addKeySubscription = this.hooks.addListener('added', async (transaction) => {
          const receipt = await waitToBeMined(this.provider, transaction.hash);
          if (receipt.status) {
            this.wallet.sendTransaction({
              to: receipt.contractAddress,
              value: ethers.utils.parseEther('0.001')
            });
          }
        });

        this.addKeysSubscription = this.hooks.addListener('keysAdded', async (transaction) => {
          const recepit = await waitToBeMined(this.provider, transaction.hash);
          if (recepit.status) {
            this.wallet.sendTransaction({
              to: receipt.contractAddress,
              value: ethers.utils.parseEther('0.005')
            });
          }
        });
      }
    }

  `Note:` Relayer will issue a new transaction after contract is deployed. Therefore ether/tokens will not appear instantly, but after a while.

  You can also take a look at `TokenGrantingRelayer <https://github.com/UniversalLogin/UniversalLoginSDK/blob/9cb7d32f0ac1e76141c32c70dbeea37ab63f78b6/universal-login-ops/src/dev/TokenGrantingRelayer.js>`_ used in dev environment.
