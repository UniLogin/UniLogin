@startuml WalletServiceStates

title Wallet Service States

[*] --> None
None --> Future
None --> Connecting
Connecting --> Deployed
Future --> Deploying
Deploying --> Future
Deploying --> Deployed

Future: FutureWallet
Future: - contractAddress
Future: - privateKey

Deploying: ApplicationWallet
Deploying: - contractAddress
Deploying: - privateKey
Deploying: - name

Connecting: ApplicationWallet
Connecting: - contractAddress
Connecting: - privateKey
Connecting: - name

Deployed: DeployedWallet
Deployed: - contractAddress
Deployed: - privateKey
Deployed: - name

@enduml
