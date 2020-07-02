@startuml
title DeployWallet process


actor user

== Deployment ==
activate user
user -> WalletService: createFutureWallet(ensName, token)
activate WalletService
WalletService -> GasModeService: getGasPrices
activate GasModeService
GasModeService -> WalletService: GasPrices
deactivate GasModeService
WalletService -> user: gasPriceInToken
deactivate WalletService
user -> Blockchain: waitForBalance()
activate Blockchain
user -> Blockchain: Funds
Blockchain -> user: Promise<BalanceDetails>
deactivate Blockchain
user -> Relayer: deploy(Deployment)
activate Relayer
Relayer -> Blockchain: check balance in token
Relayer -> user: Promise<DeploymentStatus>
actor Relayer
actor Blockchain
deactivate Relayer
deactivate user

@enduml