@startuml WalletStates

title Wallet States

None --> Future: createFuture
None --> Connecting: connect
Connecting --> Deployed: waitForConnect
Future --> Deploying: waitForDeploy
Deploying --> Deployed: waitForSuccess
Deploying --> Deploying: waitForTransactionHash
Deployed --> None: disconnect

Future: FutureWallet
Future: - contractAddress
Future: - privateKey

Deploying: DeployingWallet
Deploying: - contractAddress
Deploying: - privateKey
Deploying: - name
Deploying: - deploymentHash

Connecting: ApplicationWallet
Connecting: - contractAddress
Connecting: - privateKey
Connecting: - name

Deployed: DeployedWallet
Deployed: - contractAddress
Deployed: - privateKey
Deployed: - name

@enduml
