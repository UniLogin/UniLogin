.. _devops:

Deployment
==========

Prerequisites
  Install universal-login toolkit:

  ::

    yarn global add universal-login-ops

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