Relayer
=======

Starting relayer
----------------

There are two ways to setup relayer :ref:`from command line<from-command-line>` and :ref:`programmatically<programmatically>`.

If you would like to have your own domain, jump to the section :ref:`ENS registration<ens-registration>`
To build custom relayer jump to :ref:`Custom relayer<custom-relayer>`

.. _from-command-line:

From command line
^^^^^^^^^^^^^^^^^

To start relayer from command line, download UniversalLoginSDK from github and:

1. Create ``.env`` file in ``/universal-login-relayer`` directory and fill up .env file with parameters:

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

2. In universal-login-relayer directory type:

  ::

    yarn relayer:start

.. _programmatically:

Programmatically
^^^^^^^^^^^^^^^^

**new Relayer(config, provider, database)**

  Parameters:
    - **config** : object, specific config parameters, includes:

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


Example: connectiong to testnet 
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
Config file
^^^^^^^^^^^

Parameters: 
  - **jsonRpcUrl** : string - JSON-RPC URL of an Ethereum node
  - **privateKey** : string - private key to execute registrations
  - **ensAddress** : string - address of ENS
  - **publicResolverAddress** : string - address of public resolver

Example:
  config file: 

  .. code-block:: javascript

    const ensRegistrationConfig = {
      jsonRpcUrl: process.env.JSON_RPC_URL,
      privateKey: process.env.PRIVATE_KEY,
      chainSpec: {
        ensAddress: process.env.ENS_ADDRESS,
        publicResolverAddress: process.env.PUBLIC_RESOLVER_ADDRESS,
        chainId: 0
      }
    }

  env file:

  ::

    JSON_RPC_URL='https://ropsten.infura.io'
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0x112234455c3a32fd11230c42e7bccd4a84e02010'
    PUBLIC_RESOLVER_ADDRESS='0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A'

Register ENS domain
^^^^^^^^^^^^^^^^^^^

To register ENS domain, in universal-login-relayer directory type in the console:

  ::

    yarn register:domain my-domain tld

Parameters:
  - **my-domain** - domain to register
  - **tld** - top level domain, for example: ``eth`` or on testnets: ``test``

Example:
  ::

    yarn register:domain awesome-app test

  Result

  ::

    Registering cool-domain.test...
    Registrar address for test: 0x21397c1A1F4aCD9132fE36Df011610564b87E24b
    Registered cool-domain.test with owner: 0xf4C1A210B6436eEe17fDEe880206E9d3Ab178c18
    Resolver for cool-domain.test set to 0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A (public resolver)
    New registrar deployed: 0xf1Af1CCEEC4464212Fc7b790c205ca3b8E74ba67
    cool-domain.test owner set to: 0xf1Af1CCEEC4464212Fc7b790c205ca3b8E74ba67 (registrar)


Register ENS name
^^^^^^^^^^^^^^^^^

To register ENS name, in universal-login-relayer directory type in the console:

  ::

    yarn register:name name my-domain.test

Parameters:
  - **name** - name to register
  - **my-domain.test** - existing domain

Example:
  ::

    yarn register:name justyna cool-domain.test

  Result 

  ::

    Registgering justyna.cool-domain.test...
    Registered justyna.cool-domain.test with owner: 0xf4C1A210B6436eEe17fDEe880206E9d3Ab178c18
    Resolver for justyna.cool-domain.test set to: 0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A
    Address for justyna.cool-domain.test is 0xf4C1A210B6436eEe17fDEe880206E9d3Ab178c18
    Reverse resolver for 0xf4C1A210B6436eEe17fDEe880206E9d3Ab178c18 is 0x53350F4089B10E516c164497f395Dbbbc8675e20
    ENS name for 0xf4C1A210B6436eEe17fDEe880206E9d3Ab178c18 is justyna.cool-domain.test



.. _custom-relayer:

Custom relayer
--------------

After every operations on contract, there is emitted an event. You can add listeners to this events and transfer funds for every operation.

**this.hooks.addListener('eventType', callback)**

  subscribes an event.

  Parameters:
    - **eventType** : string - type of event, possible event types: ``created``, ``added`` and  ``keysAdded``
    - **callback**
  Returns: 
    event listener
    
  In this example, we create ether granting relayer, that gives tokens to wallet contract for creation, adding key or adding keys. 

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

  Relayer will issue a new transaction after contract is deployed. Therefore ether/tokens will not appear instantly, but after a while.