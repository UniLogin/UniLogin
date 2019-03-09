.. _tutorials:

Tutorials
=========

.. _sdk-example-testnet:


Connecting to existing app on testnet
-------------------------------------

Create wallet contract
^^^^^^^^^^^^^^^^^^^^^^

Create your own wallet contract using `Universal Login Example App <https://example.universallogin.io//>`_ and get your contract address.

Create UniversalLoginSDK
^^^^^^^^^^^^^^^^^^^^^^^^

In your project, create the UniversalLoginSDK
::

  import UniversalLoginSDK from 'universal-login-sdk';
  import ethers from 'ethers';


  const relayerUrl = 'https://relayer.universallogin.io';
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