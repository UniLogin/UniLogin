Relayer
=======

Configuration
-------------

Config file
^^^^^^^^^^^

Parameters:
  - **legacyENS** : boolean - ENS version deployed on network, for the Rinkeby testnet is ``true``, for the Ropsten testnet is ``false``
  - **jsonRpcUrl** : string - JSON-RPC URL of an Ethereum node
  - **port** : number - relayer endpoint
  - **privateKey** : string - private key of relayer wallet
  - **ensAddress** : string - address of ENS
  - **ensRegistrars** : array of strings - possible domains

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

Deploying ENS
-------------
ENS registration config
^^^^^^^^^^^^^^^^^^^^^^^

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

    JSON_RPC_URL='https://rinkeby.infura.io'
    PRIVATE_KEY='YOUR_PRIVATE_KEY'
    ENS_ADDRESS='0xe7410170f87102DF0055eB195163A03B7F2Bff4A'
    PUBLIC_RESOLVER_ADDRESS='0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc'

register ENS domain
^^^^^^^^^^^^^^^^^^^

To register ENS domain, in universal-login-relayer directory type in the console:

::

  yarn register:domain my-domain tld

Parameters:
 * my-domain - is domain, that you want to register
 * tld -  is top level domain, for example: ``eth`` or on testnets: ``test``

register ENS name
^^^^^^^^^^^^^^^^^

To register ENS name, in universal-login-relayer directory type in the console:
::

  yarn register:name name my-domain.test

Parameters:
 * name - is name, that you want to register
 * my-domain.test - is existing domain