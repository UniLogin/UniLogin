.. _sdk:

SDK
===

An SDK is a JS library that helps to communicate with a relayer. The SDK makes it easy to manage a contract by creating basic contract-calling messages. It uses a private key to sign these messages and send them to the relayer, which propagates them to the network.

.. _sdk_create:

Creating an SDK
---------------

**new UniversalLoginSDK(relayerURL, providerURL, messageOptions)**

  Parameters:
    - **relayerURL** : string - a URL address of a relayer
    - **providerURL** : string - JSON-RPC URL of an Ethereum node
    - **messageOptions** (optional) : object - specific message options as ``gasPrice`` or ``gasLimit``
  Returns:
    UniversalLoginSDK instance

  Example:
    ::

      import UniversalLoginSDK from '@universal-login/sdk';

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

Creating a wallet contract
--------------------------

createFutureWallet
^^^^^^^^^^^^^^^^^^

**sdk.createFutureWallet()**

Creates a FutureWallet, which contains all information required to deploy and use a Wallet in the future.

Returns:
  `promise` that resolves to ``FutureWallet``.

**FutureWallet** contains:

  - *privateKey* - that will be connected to ContractWallet. The key will be used to sign transactions once the wallet is deployed.
  - *contract address* - an address under which the wallet will be deployed in the future.
  - *waitForBalance* - a function that waits for a contract address balance change in a way that will allow the wallet contract to be deployed.

      Returns:
        `promise`, that resolves (only when the wallet contract balance is changed to satisfy relayer requirements) to ``{tokenAddress, contractAddress}``
  - *deploy* - a function that requests wallet contract deployment.

      Parameters:
        - **ensName** : string - a chosen ENS name
        - **gasPrice** : string - gas price of a deployment transaction

      Returns:
        `promise` that resolves to the deployed wallet contract address

Example:
  ::

    const {privateKey, contractAddress, waitForBalance, deploy} = await sdk.createFutureWallet();
    await waitForBalance();
    await deploy('myname.example-domain.eth');

connect
^^^^^^^

**sdk.connect(contractAddress)**

  requests adding a new key to a contract.

  Parameters:
    - **contractAddress** : string - an address of the contract to manage a connection
  Returns:
    `promise` that resolves to ``privateKey``, where:

    - *privateKey* - the private key that is requested to add to manage the contract

  Example:
    ::

      const privateKey = sdk.connect('0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA');

denyRequest
^^^^^^^^^^^

**sdk.denyRequest(contractAddress, publicKey, privateKey)**

  removes the request for adding a new key from pending authorizations.

  Parameters:
    - **contractAddress** : string - an address of a contract to remove a request
    - **publicKey** : string - an address to remove from add requests
    - **privateKey** : string - a private key to sign a request
  Returns:
    `promise` that resolves to ``publicKey``, where:

    - *publicKey* - an address removed from pending authorisations

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
    - **message** : object - a message that is sent to a contract, includes:

      * from : string - an address of the contract that requests execution
      * to : string - a beneficient of this execution
      * data : string - the data of execution
      * value : string - value of transaction
      * gasToken : string - token address to refund
      * gasPrice : number - price of gas to refund
      * gasLimit : number - limit of gas to refund
    - **privateKey** : string - a private key to be used to sign the transaction and has a permission to execute the message
  Returns:
    `promise` that resolves to the ``Execution``

.. _execution:

  **Execution** contains:

  - **messageStatus** - a current status of the sent message (:ref:`learn more<messageStatus>`)
  - **waitToBeMined** - a function that returns a promise that resolves to MessageStatus once the transaction enclosed with Message is mined

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

.. _messageStatus:

messageStatus
^^^^^^^^^^^^^

  .. image:: ../modeling/img/concepts/messageStatus.png

  - **required** : number - the amount of required signatures to execute the message
  - **collectedSignatures** : string[] - signatures collected by a relayer
  - **totalCollected** : number - the amount of collected signatures
  - **messageHash** : string - hash of the message
  - **state** : MessageState - one of the message states: ``AwaitSignatures``, ``Queued``, ``Pending``, ``Error``, ``Success``
  - **transactionHash** (optional) : string - a transaction hash is only possible when the message state is ``Pending``, ``Success`` or ``Error``
  - **error** (optional) : string - only when the message state is ``Error``

**sdk.getMessageStatus(messageHash)**

  requests a message status of a specific message

  Parameters:
    - **messageHash** - a hash of a message

  Returns:
    `promise` that resolves to ``MessageStatus``


.. _signer:

SdkSigner
^^^^^^^^^

::

  // gasToken should be configured when creating SDK instance in order to use the signer
  const signer = new SdkSigner(sdk, contractAddress, privateKey);

  const token = new Contract(contractAddress, contractInterface, signer)
  await contract.transfer(someOtherAddress, utils.parseEther('123'))

Note: This is an experimental feature, expect breaking changes.

Managing a wallet contract
--------------------------


addKey
^^^^^^

**sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails, keysPurpose)**

  adds a key to manage a wallet contract.

  Parameters:
    - **contractAddress** : string - an address of a contract that requests to add a new key
    - **publicKey** : string - a public key to manage the contract
    - **privateKey** : string - a private key that has a permission to add new keys
    - **transactionDetails** : object - refund options
    - **keysPurpose** (optional) : number - key purpose: MANAGEMENT_KEY - ``1``, ACTION_KEY - ``2``, set to MANAGAMENT_KEY by default
  Returns:
    `promise` that resolves to the :ref:`Execution<execution>`

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

  adds multiple keys to manage a contract.

  Parameters:
    - **contractAddress** : string - an address of a contract that requests to add keys
    - **publicKeys** : array of strings - public keys to add
    - **privateKey** : string - a private key that has a permission to add new keys
    - **transactionDetails** : object - refund options
    - **keysPurpose** (optional) : number - key purpose: MANAGEMENT - ``1``, ACTION - ``2``, set to MANAGAMENT_KEY by default
  Returns:
    `promise` that resolves to the :ref:`Execution<execution>`

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

  removes a key from a contract.

  Parameters:
    - **contractAddress** : string - an address of a contract that we want to remove a key from the contract
    - **publicKey** : string - a public key to remove
    - **privateKey** : string - a private key with a permission of removing keys
    - **transactionDetails** : object - an optional parameter that includes details of transactions for example gasLimit or gasPrice
  Returns:
    `promise` that resolves to the :ref:`Execution<execution>`

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

  gets a wallet contract address by an ENS name

  Parameters:
    - **ensName** : string - an ENS name

  Returns:
    `promise` that resolves to ``address`` if the ENS name is registered or ``null`` if the ENS name is available

  Example:
    ::

      const contractAddress = await sdk.getWalletContractAddress('justyna.my-super-domain.test');

**walletContractExist(ensName)**

  checks if an ENS name is registered.

  Parameters:
    - **ensName** : string - an ENS name

  Returns:
    `promise` that resolves to ``true`` if the ENS name is registered or ``false`` if the ENS name is available

  Example:
    ::

      const walletContractExist = await sdk.walletContractExist('justyna.my-super-domain.test');

Events
------


Key added and key removed
^^^^^^^^^^^^^^^^^^^^^^^^^

**sdk.start()**

  Starts to listen a relayer and blockchain events.

**sdk.stop()**

  Stops to listen a relayer and blockchain events.


**sdk.subscribe(eventType, filter, callback)**

  subscribes KeyAdded or KeyRemoved event.

  Parameters:
    - **eventType** : string - a type of an event, possible event types: ``KeyAdded``, ``KeyRemoved``
    - **filter** : object - a filter for events, includes:

      * contractAddress : string - an address of a contract to observe
      * key : string - a public key used to subscribe to an event
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


Authorisations
^^^^^^^^^^^^^^

**sdk.subscribeAuthorisations(walletContractAddress, privateKey, callback)**

  subscribes AuthorisationChanged event

  Parameters:
    - **walletContractAddress** : string - an address of a contract to observe
    - **privateKey** : string - a private key used to sign a get authorization request
    - **callback**

  Returns:
    unsubscribe function

  Example:
    .. code-block:: javascript

      const unsubscribe = sdk.subscribe(
        '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
        '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74',
        (authorisations) => {
          console.log(`${authorisations}`);
          unsubscribe();
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

