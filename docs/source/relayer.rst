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

Then you need to migrate database: 

  ::

    yarn setup:db



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

  example .env file

  .. code-block:: javascript

    JSON_RPC_URL='https://rinkeby.infura.io'
    PORT=3311
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0xe7410170f87102DF0055eB195163A03B7F2Bff4A'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-id.test'
    ENS_DOMAIN_3='my-super-domain.test'

**2. Run relayer**

Run following command from ``universal-login-relayer`` directory

  ::

    yarn relayer:start

.. _programmatically:

Programmatically
^^^^^^^^^^^^^^^^

To run relayer from your application you will need to create a relayer instance. Relayer constructor documentation below.

**new Relayer(config, provider, database)**

  Parameters:
    - **config** : object - specific config parameters, includes:

      - **legacyENS** : boolean - ENS version deployed on network, for the Rinkeby testnet is ``true``, for the Ropsten testnet is ``false``
      - **jsonRpcUrl** : string - JSON-RPC URL of an Ethereum node
      - **port** : number - relayer endpoint
      - **privateKey** : string - private key of relayer wallet
      - **ensAddress** : string - address of ENS
      - **ensRegistrars** : array of strings - possible domains
    - **provider** : object (optional) - instance of provider of an Ethereum node
    - **database** : object - ``knex`` an SQL query builder
  Returns:
    Relayer instance
  Example
    ::

      import knex from 'knex';
      import Relayer from 'unviersal-login-relayer';

      const config = {
        legacyENS: true,
        jsonRpcUrl: 'https://rinkeby.infura.io',
        port: 3311,
        privateKey: 'YOUR_PRIVATE_KEY',
        chainSpec: {
          ensAddress: '0xe7410170f87102DF0055eB195163A03B7F2Bff4A',
          chainId: 0
        },
        ensRegistrars: [
          'poppularapp.test', 
          'my-id.test', 
          'my-super-domain.test'
        ]

        const knexConfig = {
        client: 'postgresql',
        connection: {
          database: 'universal_login_relayer_development',
          user:     'postgres',
          password: 'postgres'
        },
        migrations: {
          directory: path.join(__dirname, './node_modules/universal-login-relayer/migrations')
        }
      };
    
      const database = knex(knexConfig);
      const relayer = new Relayer(config, '', database);
      relayer.start();


Example: connecting to testnet 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  config.js file

  .. code-block:: javascript

    const config = {
      legacyENS: true,
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
      ]
    }

  .env file

  .. code-block:: javascript

    JSON_RPC_URL='https://rinkeby.infura.io'
    PORT=3311
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0xe7410170f87102DF0055eB195163A03B7F2Bff4A'
    ENS_DOMAIN_1='poppularapp.test'
    ENS_DOMAIN_2='my-id.test'
    ENS_DOMAIN_3='my-super-domain.test'

.. _ens-registration:

ENS registration
----------------

To use UniversalLogin with your own ENS domain, you will need to register it, connect to the resolver and deploy own registrar. There is a script for that.

`Note:` script currently works only for ``.test`` domains. Tested on the Rinkeby and the Ropsten test networks. 

You can register domain on two ways: from command line and programmatically.
To use registered domain in your relayer, type its name in relayer config.


From command line
^^^^^^^^^^^^^^^^^
First, prepare ``.env`` file in universal-login-relayer directory. 

Parameters:
  - **JSON_RPC_URL** : string - JSON-RPC URL of an Ethereum node
  - **PRIVATE_KEY** : string - private key to execute registrations. `Note:` You need to have ether on it to pay for contracts deployment.
  - **ENS_ADDRESS** : string - address of ENS 
  - **PUBLIC_RESOLVER_ADDRESS** : string - address of public resolver. For the Ropsten test network working public resolver address is ``0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A`` and for the Rinkeby test network public resolver address is ``0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc``.

  Example ``.env`` file:

  ::

    JSON_RPC_URL='https://ropsten.infura.io'
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0x112234455c3a32fd11230c42e7bccd4a84e02010'
    PUBLIC_RESOLVER_ADDRESS='0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A'

To register ENS domain, in universal-login-relayer directory type in the console:

  ::

    yarn register:domain my-domain tld

Parameters:
  - **my-domain** - domain to register
  - **tld** - top level domain, for example: ``eth`` or on testnets: ``test``

  Example:

  ::

    yarn register:domain cool-domain test

  Result:

  ::

    Registering cool-domain.test...
    Registrar address for test: 0x21397c1A1F4aCD9132fE36Df011610564b87E24b
    Registered cool-domain.test with owner: 0xf4C1A210B6436eEe17fDEe880206E9d3Ab178c18
    Resolver for cool-domain.test set to 0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A (public resolver)
    New registrar deployed: 0xf1Af1CCEEC4464212Fc7b790c205ca3b8E74ba67
    cool-domain.test owner set to: 0xf1Af1CCEEC4464212Fc7b790c205ca3b8E74ba67 (registrar)



Programmatically
^^^^^^^^^^^^^^^^

To register own ENS domain programmatically, you should use DomainRegistrar. 

**new DomainRegistrar(config)**
  creates DomainRegistrar.

  Parameters: 
    - **config** : object - specific config parameters, includes: 

      - **jsonRpcUrl** : string - JSON-RPC URL of an Ethereum node
      - **privateKey** : string - private key to execute registrations
      - **ensAddress** : string - address of ENS
      - **publicResolverAddress** : string - address of public resolver
  Returns:
    DomainRegistrar instance

  Example:
    ::

      const ensRegistrationConfig = {
        jsonRpcUrl: 'https://ropsten.infura.io',
        privateKey: 'YOUR_PRIVATE_KEY',
        chainSpec: {
          ensAddress: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
          publicResolverAddress: '0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A',
          chainId: 0
        }
      }
      const registrar = new DomainRegistrar(ensRegistrationConfig);

**registrar.registerAndSave(domain, tld)** 
  registers new domain and saves to new file all informations about newly registered domain (registrar address or resolver address)

  Parameters:
    - **domain** : string - domain to register
    - **tld** : string - top level domain, for example: ``eth`` or on testnets: ``test``

  Example:
    ::

      registrar.registerAndSave('new-domain', 'test');

  Result:
    file named ``extra-domain.test_info`` that includes:
    ::

        DOMAIN='extra-domain.test'
        PUBLIC_RESOLVER_ADDRESS='0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A'
        REGISTRAR_ADDRESS='0xEe0b357352C7Ba455EFD0E20d192bC44F1Bf8d22'

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
    import waitToBeMined from 'universal-login-contracts';

    class EtherGrantingRelayer extends Relayer {
      constructor(config, provider = '', database) {
        super(config, provider, database);
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
