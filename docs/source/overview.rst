.. _overview:


Overview
========

.. _introduction:

Introduction
------------

Technical concepts
^^^^^^^^^^^^^^^^^^

Technically Universal Login utilizes four major concepts:

- **Personal multi-sig wallet** - a smart contract used to store personal funds. A user gets his wallet created in a barely noticeable manner. The user then gets engaged incrementally to add authorization factors and recovery options.
- **Meta-transactions** - that gives user ability to interact with the smart contract from multiple devices easily, without a need to store ether on each of those devices. Meta-transactions enable payments for execution with tokens.
- **ENS names** - naming your wallet with easy-to-remember human-readable name
- **Universal login** - wallet name can be used to log in to dapps, web, and native applications

Components
^^^^^^^^^^
Universal Login has three components. All components are stored in one monorepo `available here <https://github.com/universallogin>`_.
Components are listed below:

- `Contracts <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-contracts>`_ - smart contracts used by Universal Login, along with some helper functions
- `Relayer <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-relayer>`_ - HTTP REST server that relays meta-transactions to Universal Login smart contracts
- `SDK <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-sdk>`_ - javascript API, a thin communication layer that interacts with the Universal Login ecosystem, via both relayer and Ethereum node.
- `React <https://github.com/UniversalLogin/UniversalLoginSDK/tree/master/universal-login-react>`_ - typescript library, that contains Universal Login main components to use in react applications.


Dependencies
^^^^^^^^^^^^
The diagram below shows dependencies between components.

.. image:: ../modeling/img/concepts/Packages.png


The external interfaces present in the Universal Login system are identified by the lollipop use symbol:

<<IF-6>> RELAYER HTTP JSON IF
  this interface defines an off-chain remote API for ERC #1077 and #1078
<<IF-9>> ETH JSON-RPC IF
  this interface is the Ethereum JSON-RPC API for the on-chain execution

The internal interfaces defined within the Universal Login system are identified by the arrow use symbol. The main ones are:

<<IF-2>> UL SDK IF
  the JS applications using Universal Login shall be based on this library interface to conveniently attach to the Relayer subsystem and route their meta transactions
<<IF-4>> ERC1077 SIG IF
  this interface is a message hash and signature JS facility API for ERC #1077
<<IF-5>> ERC1077 IF / ERC1078 IF
  this interface is made up of ERC #1077 and #1078 smart contracts ABI


.. _main_concepts:

Main concepts
-------------


Deploy
^^^^^^


Deployment is designed in the way, that user pays for himself. To do that, we use counterfactual deployment. (``create2`` function to deploy contract)

The process looks like follows:

- **computing contract address** - SDK computes deterministic contract address. Contract address is unique and is obtained from the users public key and factory contract address connected to particular relayer.

- **waiting for balance** - User sends funds on this address. He can transfer ether on his own or use on-ramp provider. SDK waits for future contract address balance change. If SDK discovers, that required funds are on this balance, sends deploy request to relayer.

- **deploy** - Relayer deploys the contract and immediately gets the refund from the contract.

- **refund** - During deployment contract will refund the cost of the transaction to the relayer address.


Deploy in-depth
^^^^^^^^^^^^^^^


SDK create deploy. Deploy contains the following parameters:

.. image:: ../modeling/img/concepts/Deployment.png

- **ensName** - ENS name chosen by user. It is the only parameter provided by the user.
- **publicKey** - the public key of newly generated key pair on a users device.
- **ensAddress** - address of ENS contract. It is required to properly register the ENS name.
- **resolverAddress** - address of Resolver contract. It is required to properly register the ENS name.
- **registrarAddress** - address of Registrar contract. It is required to properly register the ENS name.
- **gasPrice** - gas price used in the refund process.
- **signature** - the signature of all of the arguments above. Signature ensures parameters comes from the owner of the private key (paired to the public key). In particular, it prevents against malicious ENS name registration and gas price replacement.


**ENS name collision**

Deploy contains ENS name so it could fail (for example when ens name is taken). That's why we require success on register ENS name. If it fails, the contract won't be deployed, so the user can choose ENS name once again and register it on the same contract address.


**Deployment lifecycle**

It starts when the user generates contract address signed to him. The first half of deployment is waiting for the user to send funds to the computed contract address.

.. image:: ../modeling/img/concepts/DeploymentStates.png



Meta-transactions
^^^^^^^^^^^^^^^^^

Message (also known as meta-transaction or signed messages) is a way to trigger ethereum transaction from an application or device that does not possess any ether. The message states the intention of the user. It requests a wallet contract to execute a transaction. (eg.: funds transfer, external function call or internal function call - i.e. operation in wallet contract itself). An application sends message signed with one or more of the keys whitelisted in the contract to the relayer server. Relayer than wraps message into ethereum transaction. The message is then processed by the contract as a function call. Relayer wallet is paying for transaction gas. Wallet refunds cost of execution back to the relayer in Ether or ERC20 token. The message contains the following parameters:

.. image:: ../modeling/img/concepts/Message.png

- **to** - recipient of a message call
- **from** - address of a contract that executes message
- **value** - value to send
- **data** - data for the transaction (i.e. encoded function call)
- **gasToken** - token address to refund
- **gasLimit** - maximum gas to use in for a specific transaction
- **gasPrice** - gas price to use in the refund process
- **nonce** - internal nounce of the transaction relative to the contract wallet
- **operationType** - type of execution (call, delegatecall, create)
- **signature** - the signature of all of the arguments above, which ensures parameters comes from the owner of the allowed private-public key pair


**Message lifecycle**

The message starts it's journey when it is created and signed by the user (i.e. application or SDK) and then sent to relayer. In relayer it goes through the following states:

.. image:: ../modeling/img/concepts/MessageStates.png

- **await signature** ``optional``- Relayer waits to collect all required signatures if the message requires more than one signature.
- **queued** - Message is queued to be sent.
- **pending** - Message is propagated to the network and waits to be mined. In a pending state, the message has a transaction hash.
- **sucess** / **error** - Mined transaction is a success or an error. In a success state, the content of message status is not changed. In an error state, the message has an error message.




Connection new device
^^^^^^^^^^^^^^^^^^^^^

One of the key activities is connecting the newly created public key to the existing smart contract wallet. The new public key is created on a new device or application that never interacted with the smart contract wallet before. See below.

.. image:: static/connect/setup.png

The new public key is added using meta-transaction. Meta-transaction needs to be signed with the private key from a device that already is authorized in the wallet smart contract. After signing, meta-transaction is sent to the relayer, which propagates it to the blockchain. Below picture shows this process.

.. image:: static/connect/expected.png

There are four key actors in the process:

- **Old device** or application that is already authorized. Authorized means there is a public and private key pair, where the private key is stored on the device and public key is in the wallet smart contract on the blockchain.
- **New device** (or new application) that we want to authorize to use wallet smart contract. To do that we need to generate **new key pair** (new public key and private key) and add the new public key to wallet contract as management or action key. Adding key is creating meta-transaction signed by the old device (old private key) and sending to relayer.
- **Relayer** - relays meta-transaction sent from an old device to blockchain
- **Smart Contract Wallet** - smart contract that stores keys and executes meta-transactions.


**Possible attacks**


The problem might seem pretty straightforward, but there are some complexities to consider. In particular, we should avoid introducing the possibility of the following attacks:

* Man in the middle

A man-in-the-middle attack can happen when a new device sends the new public key to the old device. A malicious actor that intercepts communication (e.g. relayer) can switch new public key with its new public key and as a result, can take over control of the wallet contract.

.. image:: static/connect/man-in-the-middle.png

* Spamming

Spam attack can happen when a lot of new devices request connect to an old device, therefore the old device is spamming with many notifications.

.. image:: static/connect/spamming.png


**Solution 1**

The first solution is pretty straightforward. New device transfers it's public key to the old device.

.. image:: static/connect/solution-1.png


**Transfer means**

There are two possible ways of transferring the public key.

Note: This is a public key, so we don't worry about intercepting.

Note: The seed for ecliptic curve key that we use has 128bits or 16 bytes.

* Scan the QR code
* Manually copy public key by typing. That might have different shades.

  * Retype the letters (32 chars if hex or 26 with just mix cased letters + digits).
  * Use emojis (12 emojis with 1000 emoji base), see example interface below.

  .. image:: static/connect/emoji.png

  * If both applications are on the some on one device -> copy paste. (or in some cases even send by e-mail)


**Solution 2**

The second solution might be useful if, for some reason, we want to transfer information from the old device to the new device. That might make a difference in the case of using QR codes and old device does not possess a camera.

The process goes as follows:

1. The old device generates a temporary key pair.

2. The private key gets transferred to the new device.

3. The new device encrypts a new public key using a temporary private key.

4. The old device sends meta-transaction via relayer to the wallet smart contract.

5. On successful decryption, the old device sends meta-transaction to relayer to add the new public key to wallet smart contract.

.. image:: static/connect/solution-2.png

**Solution 3**

The third solution is an alternative to previous solutions. The new device generates a new key pair and shows to user emojis based on a hash of the new public key to later use on an old device. The newly generated public key is sent to the relayer and forwarded to the old device. To finalize connecting a new device, the user has to arrange emojis in the exact order. See below.

.. image:: static/connect/solution-3.png

In the case of spamming, the user has to type exact emojis unlike arranging.


.. _development:

Development environment
-----------------------

Development environment helps quickly develop and test applications using universal login.
The script that starts development environment can be run from ``@universal-login/ops`` project.
The script does a bunch of helpful things:

- creates a mock blockchain (ganache)
- deploys mock ENS
- registers three testing ENS domains: ``mylogin.eth``, ``universal-id.eth``, ``popularapp.eth``
- deploys example ERC20 Token that can be used to pay for transactions
- creates a database for a relayer
- starts local relayer

For more go to :ref:`tutorial<development_environment>`

