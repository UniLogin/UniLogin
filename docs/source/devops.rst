.. _devops:

Deployment
==========

Prerequisites
  Install universal-login toolkit:

  ::

    yarn global add @universal-login/ops

Test token
----------

To deploy test token use deploy token
``universal-login deploy:token --nodeUrl [url] --privateKey [privateKey]``

Example:

::

  universal-login deploy:token --nodeUrl http://localhost:18545 --privateKey 0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797


Sending funds
-------------

To send funds to an address
``universal-login send [to] [amount] [currency] --nodeUrl [url] --privateKey [privateKey]``

Parameters:
  - **to** - an address to send funds
  - **amount** - amount to send to the address
  - **currency** - currency of transfer
  - **nodeUrl** (optional) - JSON-RPC URL of an Ethereum node, set to ``http://localhost:18545`` by default
  - **privateKey** (optional) - private key of wallet with additional balance, set to ``DEV_DEFAULT_PRIVATE_KEY`` by default and has enoguh ethers


Example:

::

  universal-login send 0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA 4 ETH




.. _ens-registration:

ENS registration
----------------

To use Universal Login with your own ENS domain, you will need to register it, connect to the resolver and deploy own registrar. There is a script for that.

`Note:` script currently works only for ``.test`` domains. Tested on the Rinkeby and the Ropsten test networks.

You can register domain on two ways: from command line and programmatically.
To use registered domain in your relayer, type its name in relayer config.


From command line
^^^^^^^^^^^^^^^^^
First, prepare ``.env`` file in universal-login-ops directory.

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

To register ENS domain, in universal-login-ops directory type in the console:

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
