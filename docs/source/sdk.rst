UniversalLoginSDK
=================

UniversalLoginSDK is a JS library, that helps to communicate with relayer. SDK makes easy to manage contract, by creating basic contract-calling messages. It uses private key to sign that messages and sends it to relayer, which propagates it to network.

Creating SDK
^^^^^^^^^^^^

SDK takes 3 parameters: relayer URL, provider or provider URL and message options:
::

  import UniversalLoginSDK from 'universal-login-sdk';

  const universalLoginSDK = new UniversalLoginSDK(
    'http://myrelayer.ethworks.io', 
    'https://ropsten.infura.io', 
    { gasLimit: 100000 }
  );

The last parameter is message options and it is optional. If no message options provided, sdk use default message options:
::

  {
    gasPrice: 1000000000,
    gasLimit: 1000000,
    operationType: OPERATION_CALL
  }


Creating contract
^^^^^^^^^^^^^^^^^

**sdk.create(ensName)**

  *Create* function creates new contract. It returns `promise`, that returns **privateKey** (to manage contract) and deployed **contract address**. Contract address is assign to the choosen ENS name.

* **ensName** - choosen ENS name with existing domain

  Example

  ::

    const [privateKey, contractAddress] = await sdk.create('myname.example-domain.eth');



Managing contract
^^^^^^^^^^^^^^^^^


addKey
######

**sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails, keysPurpose)**

  This function adds key to manage contract.

* **contractAddress** - address of contract, that we want add key to

* **publicKey** - public key, that we want to add

* **privateKey** - private key that has permission to add new keys

* **transactionDetails** - refund options

* **keysPurpose** - keysPurpose is MANAGAMENT_KEY by default


  Example

  :: 

    const transactionDetails = {
      gasToken: '0x850437540FE07d02045f88cAe122Bc66B1BdE957',
      gasPrice: 1000000,
      gasLimit: 150000
    };
    await sdk.addKeys(
      '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA', 
      '0x96E8B90685AFD981453803f1aE2f05f8Ebc3cfD0', 
      '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74', 
      transactionDetails, 
      ACTION_KEY
    );


addKeys
#######

**sdk.addKeys(contractAddress, publicKeys, privateKey, transactionDetails, keysPurpose)**

  This function adds multiple keys to manage contract.

* **contractAddress** - address of contract, that we want add key to

* **publicKeys** - an array that includes all public keys we want to add

* **privateKey** - private key that has permission to add new keys

* **transactionDetails** - refund options

* **keysPurpose** - keysPurpose is MANAGAMENT_KEY by default

  Example

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
#########

**sdk.removeKey(contractAddress, publicKey, privateKey, transactionDetails)**
  
  This function removes key from contract.


* **contractAddress** - address of contract, that we want remove key from

* **publicKey** - public key to remove

* **privateKey** - private key with permission of removing key

* **transactionDetails** - optional parameter, that includes details of transactions for example gasLimit or gasPrice

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
#######

**sdk.execute(message, privateKey)**
 
  This function can execute any message. It takes two parameters: message and privateKey. Provided message is signed and sent to relayer.

* **message** - message that is sent to contract, includes: 

  * contractAddress - address of contract that requests execution
  * to - beneficient of this execution
  * data - data of execution
  * value - value of transaction
  * gasToken, gasPrice, gasLimit - refund options 



* **privateKey** - private key that has permission to execute message

  Example

  ::

    const message = {
      contractAddress: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA', 
      to: '0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A', 
      data: '0x0', 
      value: '500000000000000000', 
      gasToken: '0x9f2990f93694B496F5EAc5822a45f9c642aaDB73, 
      gasPrice: 1000000000, 
      gasLimit: 1000000
    };

    await sdk.execute(message, privateKey);

    
 
 In this case contract *0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA* sends 0.5 eth to *0xbA03ea3517ddcD75e38a65EDEB4dD4ae17D52A1A*. After execute this, contract returns to relayer execution costs in gasToken (*0x9f2990f93694B496F5EAc5822a45f9c642aaDB73*), with gasPrice = 1000000000.

    


