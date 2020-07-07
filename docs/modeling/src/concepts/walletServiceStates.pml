@startuml WalletStates

title Wallet States

None --> Requested: createWallet
Requested --> Requested: waiting for e-mail confirmation
Requested --> ConfirmedEmail: confirmed
ConfirmedEmail --> Future: createFuture
Future --> Future: waiting for balance
None --> Connecting: connect
Connecting --> Deployed: waitForConnect
Future --> Deploying: waitForDeploy
Deploying --> Deployed: waitForSuccess
Deploying --> Deploying: waitForTransactionHash
Deployed --> None: disconnect

Requested: * e-mail
Requested: * ensName

ConfirmedEmail: * e-mail
ConfirmedEmail: * ensName

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
