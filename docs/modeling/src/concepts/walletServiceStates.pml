@startuml WalletStates

title Wallet States

None --> RequestedCreating: createWallet
RequestedCreating --> RequestedCreating: waiting for e-mail confirmation
RequestedCreating --> ConfirmedEmailCreating: confirmed
ConfirmedEmailCreating --> Future: createFuture
Future --> Future: waiting for balance
None --> RequestedRestoring: requestRestore
None --> Connecting: connect
RequestedRestoring --> RequestedRestoring: waiting for e-mail confirmation
RequestedRestoring --> Restoring: confirmed
Restoring --> Restoring: waiting for password
Restoring --> Deployed: decrypt with password
Connecting --> Deployed: waitForConnect
Future --> Deploying: waitForDeploy
Deploying --> Deployed: waitForSuccess
Deploying --> Deploying: waitForTransactionHash
Deployed --> None: disconnect

RequestedCreating: * e-mail
RequestedCreating: * ensName

ConfirmedEmailCreating: * e-mail
ConfirmedEmailCreating: * ensName

RequestedRestoring: * e-mail
RequestedRestoring: * ensName

Restoring: * walletJSON
Restoring: * contractAddress
Restoring: * name

Future: * contractAddress
Future: * privateKey
Future: * ensName
Future: * e-mail

Deploying: * contractAddress
Deploying: * privateKey
Deploying: * name
Deploying: * deploymentHash

Connecting: * contractAddress
Connecting: * privateKey
Connecting: * name

Deployed: * contractAddress
Deployed: * privateKey
Deployed: * name


@enduml
