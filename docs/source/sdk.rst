UniversalLoginSDK
=================

UniversalLoginSDK is a JS library, that helps to communicate with relayer. SDK makes easy to manage contract, by creating basic contract-calling messages. It uses private key to sign that messages and sends it to relayer, which propagates it to network.

Creating SDK
------------

**new UniversalLoginSDK(relayerURL, providerURL, messageOptions)**

  Parameters:
    - **relayerURL** : string - URL address of relayer
    - **providerURL** : string - JSON-RPC URL of an Ethereum node
    - **messageOptions** (optional) : object - specific message options as gasPrice or gasLimit
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



Creating contract
-----------------

create
^^^^^^

**sdk.create(ensName)**

  creates new wallet contract.
  
  Parameters:
    - **ensName** : string - choosen ENS name with existing domain
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


Managing contract
-----------------


addKey
^^^^^^

**sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails, keysPurpose)**

  adds key to manage wallet contract.

  Parameters:
    - **contractAddress** : string - address of contract that requests to add new key
    - **publicKey** : string - public key to manage contract
    - **privateKey** : string - private key that has permission to add new keys
    - **transactionDetails** : object - refund options
    - **keysPurpose** (optional) : number - key purpose: MANAGEMENT - ``1``, ACTION - ``2``, set to MANAGAMENT_KEY by default
  Returns:
    `promise`, that resolves to execution nonce

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
    `promise`, that resolves to execution nonce

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
    `promise`, that resolves to execution nonce

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


execute
^^^^^^^

**sdk.execute(message, privateKey)**
 
  executes any message.

  Parameters:
    - **message** : object - message that is sent to contract, includes: 

      * contractAddress : string - address of contract that requests execution
      * to : string - beneficient of this execution
      * data : string - data of execution
      * value : string - value of transaction
      * gasToken : string - token address to refund
      * gasPrice : number - price of gas to refund
      * gasLimit : number - limit of gas to refund
    - **privateKey** : string - private key that has permission to execute message
  Returns:
    `promise`, that resolves to execution nonce

  Example:
    ::

      const message = {
        contractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA', 
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


Events
------

**sdk.start()**

  Starts to listen relayer and blockchain events.

**sdk.stop()**

  Stops to listen relayer and blockchain events.

Subscribe Event
^^^^^^^^^^^^^^^

**sdk.subscribe(eventType, filter, callback)**

  subscribes an event.

  Parameters:
    - **eventType** : string - type of event, possible event types: ``KeyAdded``, ``KeyRemoved`` and  ``AuthorisationsChanged``
    - **filter** : object - filter for events, includes:

      * contractAddress : string - address of contract to observe
      * key (optional) : string - public key, using when subsrcibe only events with specific key
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
          // 0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A was added
        }
      );

    .. code-block:: javascript

      const filter = {
        contractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA'
      };
      const subscription = sdk.subscribe(
        'AuthorisationsChanged', 
        filter, 
        (authorisations) => {
          console.log(`${authorisations}`); 
          // [{deviceInfo: 
          //    {
          //      ipAddress: '89.67.68.130',
          //      browser: 'Safari',
          //      city: 'Warsaw'
          //    }, 
          //  id: 1, 
          //  identityAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA', 
          //  key: ''}]
        }
      );

    
Unsubscribe Event
^^^^^^^^^^^^^^^^^

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

Example use of Events:
^^^^^^^^^^^^^^^^^^^^^^

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

.. _linking-pages:

Example use
------------

Create wallet contract
^^^^^^^^^^^^^^^^^^^^^^

Create your own wallet contract using `Universal Login Example App <https://example.universallogin.io//>`_ and get your contract address.

Create UniversalLoginSDK
^^^^^^^^^^^^^^^^^^^^^^^^

In your project, create the UniversalLoginSDK
::

  import UniversalLoginSDK from 'universal-login-sdk';
  import ethers from 'ethers';

  
  const relayerUrl = 'https://universal-login-relayer.herokuapp.com';
  const jsonRpcUrl = 'https://rinkeby.infura.io';

  const universalLoginSDK = new UniversalLoginSDK(relayerUrl, jsonRpcUrl);

Start listen events
^^^^^^^^^^^^^^^^^^^

Then make UniversalLoginSDK start listening relayer and blockchain events
::

  sdk.start();

Request connection
^^^^^^^^^^^^^^^^^^

Now, you can request connection to created wallet contract
::

  const privateKey = await sdk.connect('YOUR_CONTRACT_ADDRESS');

Subscribe KeyAdded
^^^^^^^^^^^^^^^^^^

Subscribe ``KeyAdded`` event with your new key filter
::

  const key = new ethers.Wallet(privateKey).address;
  const filter = 
    {
      contractAddress: 'YOUR_CONTRACT_ADDRESS',
      key
    }; 
  
  const subscription = sdk.subscribe(
    'KeyAdded',
    filter,
    (keyInfo) => 
      {
        console.log(`${keyInfo.key} now has permission to manage wallet contract`);
      });

Accept connection request
^^^^^^^^^^^^^^^^^^^^^^^^^

Accept connection request in Universal Login Example App. After that your newly created key has permission to manage your wallet contract.

Stop listen events
^^^^^^^^^^^^^^^^^^

Remember about stop listening relayer and blockchain events 
::

  sdk.stop();