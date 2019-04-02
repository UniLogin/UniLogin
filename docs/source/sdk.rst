.. _sdk:

SDK
===

SDK is a JS library, that helps to communicate with relayer. SDK makes easy to manage contract, by creating basic contract-calling messages. It uses private key to sign that messages and sends it to relayer, which propagates it to network.

.. _sdk_create:

Creating SDK
------------

**new UniversalLoginSDK(relayerURL, providerURL, messageOptions)**

  Parameters:
    - **relayerURL** : string - URL address of relayer
    - **providerURL** : string - JSON-RPC URL of an Ethereum node
    - **messageOptions** (optional) : object - specific message options as ``gasPrice`` or ``gasLimit``
  Returns:
    UniversalLoginSDK instance

  Example:
    ::

      import UniversalLoginSDK from 'universal-login-sdk';

      const messageOptions = {
        gasPrice: 1500000000,
        gasLimit: 2000000,
        operationType: OPERATION_CALL
      };
      const universalLoginSDK = new UniversalLoginSDK(
        'http://myrelayer.ethworks.io',
        'http://localhost:18545',
        messageOptions
      );



.. _sdk_create_contract:

Creating wallet contract
------------------------

create
^^^^^^

**sdk.create(ensName)**

  creates new wallet contract.

  Parameters:
    - **ensName** : string - choosen ENS name with existing domain (ENS domain supported by relayer)
  Returns:
    `promise`, that resolves to a pair ``[privateKey, contractAddress]``, where:

    - *privateKey* - private key assigend to the wallet contract for signing future transactions
    - *contract address* - address of newly deployed wallet contract, with choosen ENS name assigned

  Example:
    ::

      const [privateKey, contractAddress] = await sdk.create('myname.example-domain.eth');

connect
^^^^^^^

**sdk.connect(contractAddress)**

  requests of adding a new key to contract.

  Parameters:
    - **contractAddress** : string - address of contract to manage a connect
  Returns:
    `promise`, that resolves to ``privateKey``, where:

    - *privateKey* - private key that is requested to add to manage contract

  Example:
    ::

      const privateKey = sdk.connect('0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA');

denyRequest
^^^^^^^^^^^

**sdk.denyRequest(contractAddress, publicKey)**

  removes request of adding new key from pending authorisations.

  Parameters:
    - **contractAddress** : string - address of contract to remove request
    - **publicKey** : string - address to remove from add requests
  Returns:
    `promise`, that resolves to ``publicKey``, where:

    - *publicKey* - address removed from pending authorisations

  Example:
    ::

      const publicKey = await sdk.denyRequest('0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA', '0xb19Ec9bdC6733Bf0c825FCB6E6Da95518DB80D13');

Transaction execution
---------------------

.. _sdk_execute:

execute
^^^^^^^

**sdk.execute(message, privateKey)**

  executes any message.

  Parameters:
    - **message** : object - message that is sent to contract, includes:

      * from : string - address of contract that requests execution
      * to : string - beneficient of this execution
      * data : string - data of execution
      * value : string - value of transaction
      * gasToken : string - token address to refund
      * gasPrice : number - price of gas to refund
      * gasLimit : number - limit of gas to refund
    - **privateKey** : string - a private key to be used to sign the transaction and has permission to execute message
  Returns:
    `promise`, that resolves to the hash of the on-chain transaction

  Example:
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

      await sdk.execute(
        message,
        '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74'
      );



  In this case contract ``0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA`` sends 0.5 eth to ``0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A``.

.. _signer:

SdkSigner
^^^^^^^^^

::

  // gasToken should be configured when creating SDK instance in order to use the signer
  const signer = new SdkSigner(sdk, contractAddress, privateKey);

  const token = new Contract(contractAddress, contractInterface, signer)
  await contract.transfer(someOtherAddress, utils.parseEther('123'))

Note: This is an experimental feature, expect breaking changes.

Managing wallet contract
------------------------


addKey
^^^^^^

**sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails, keysPurpose)**

  adds key to manage wallet contract.

  Parameters:
    - **contractAddress** : string - address of contract that requests to add new key
    - **publicKey** : string - public key to manage contract
    - **privateKey** : string - private key that has permission to add new keys
    - **transactionDetails** : object - refund options
    - **keysPurpose** (optional) : number - key purpose: MANAGEMENT_KEY - ``1``, ACTION_KEY - ``2``, set to MANAGAMENT_KEY by default
  Returns:
    `promise`, that resolves to the hash of the on-chain transaction

  Example:
    ::

      const transactionDetails = {
        gasToken: '0x850437540FE07d02045f88cAe122Bc66B1BdE957',
        gasPrice: 1000000,
        gasLimit: 150000
      };
      await sdk.addKey(
        '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
        '0x96E8B90685AFD981453803f1aE2f05f8Ebc3cfD0',
        '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74',
        transactionDetails,
        ACTION_KEY
      );


addKeys
^^^^^^^

**sdk.addKeys(contractAddress, publicKeys, privateKey, transactionDetails, keysPurpose)**

  adds multiple keys to manage contract.

  Parameters:
    - **contractAddress** : string - address of contract that requests to add keys
    - **publicKeys** : array of strings - public keys to add
    - **privateKey** : string - private key that has permission to add new keys
    - **transactionDetails** : object - refund options
    - **keysPurpose** (optional) : number - key purpose: MANAGEMENT - ``1``, ACTION - ``2``, set to MANAGAMENT_KEY by default
  Returns:
    `promise`, that resolves to the hash of the on-chain transaction

  Example:
    ::

      const publicKeys = [
        '0x96E8B90685AFD981453803f1aE2f05f8Ebc3cfD0',
        '0xb19Ec9bdC6733Bf0c825FCB6E6Da95518DB80D13'
      ];
      const transactionDetails = {
        gasToken: '0x850437540FE07d02045f88cAe122Bc66B1BdE957',
        gasPrice: 1000000,
        gasLimit: 150000
      };
      await sdk.addKeys(
        '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
        publicKeys,
        '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74',
        transactionDetails,
        ACTION_KEY
      );

removeKey
^^^^^^^^^

**sdk.removeKey(contractAddress, publicKey, privateKey, transactionDetails)**

  removes key from contract.

  Parameters:
    - **contractAddress** : string - address of contract, that we want remove key from
    - **publicKey** : string - public key to remove
    - **privateKey** : string - private key with permission of removing key
    - **transactionDetails** : object - optional parameter, that includes details of transactions for example gasLimit or gasPrice
  Returns:
    `promise`, that resolves to the hash of the on-chain transaction

  Example
    ::

      const transactionDetails = {
        gasToken: '0x9f2990f93694B496F5EAc5822a45f9c642aaDB73',
        gasPrice: 1000000,
        gasLimit: 150000
      };
      await sdk.removeKey(
        '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
        '0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A',
        '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74',
        transactionDetails
      );

**getWalletContractAddress(ensName)**

  gets wallet contract address by ENS name

  Parameters:
    - **ensName** : string - ENS name

  Returns:
    `promise`, that resolves to ``address`` if ENS name is registered or ``null`` if ENS name is available

  Example:
    ::

      const contractAddress = await sdk.getWalletContractAddress('justyna.my-super-domain.test');

**walletContractExist(ensName)**

  checks if ENS name is registered.

  Parameters:
    - **ensName** : string - ENS name

  Returns:
    `promise`, that resolves to ``true`` if ENS name is registered or ``false`` if ENS name is available

  Example:
    ::

      const walletContractExist = await sdk.walletContractExist('justyna.my-super-domain.test');

Events
------

**sdk.start()**

  Starts to listen relayer and blockchain events.

**sdk.stop()**

  Stops to listen relayer and blockchain events.

Subscribe
^^^^^^^^^

**sdk.subscribe(eventType, filter, callback)**

  subscribes an event.

  Parameters:
    - **eventType** : string - type of event, possible event types: ``KeyAdded``, ``KeyRemoved`` and  ``AuthorisationsChanged``
    - **filter** : object - filter for events, includes:

      * contractAddress : string - address of contract to observe
      * key (optional) : string - public key, using when subscribe to events with specific key (only for ``KeyAdded`` and ``KeyRemoved``)
    - **callback**
  Returns:
    event listener

  Example:
    .. code-block:: javascript

      const filter = {
        contractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
        key: '0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A'
      };
      const subscription = sdk.subscribe(
        'KeyAdded',
        filter,
        (keyInfo) => {
          console.log(`${keyInfo.key} was added.`);
        }
      );

    Result
    ::

      0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A was added

  Example:
    .. code-block:: javascript

      const filter = {
        contractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA'
      };
      const subscription = sdk.subscribe(
        'AuthorisationsChanged',
        filter,
        (authorisations) => {
          console.log(`${authorisations}`);
        }
      );

    Result
    ::

      [{deviceInfo:
          {
            ipAddress: '89.67.68.130',
            browser: 'Safari',
            city: 'Warsaw'
          },
        id: 1,
        walletContractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
        key: ''}]

Unsubscribe
^^^^^^^^^^^

**subscription.remove()**

  removes subscription

  Example:
    .. code-block:: javascript

      const subscription = sdk.subscribe(
        'KeyAdded',
        filter,
        (keyInfo) => {
          subscription.remove();
        }
      );

Example
^^^^^^^

  ::

    import {Wallet} from 'ethers';

    const privateKey = await sdk.connect('0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA');
    const wallet = new Wallet(privateKey);
    const filter = {
      contractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
      key: wallet.address
    };
    const subscription = sdk.subscribe(
      'KeyAdded',
      filter,
      (keyInfo) => {
        this.myWallet = wallet;
        subscription.remove();
      }
    );
