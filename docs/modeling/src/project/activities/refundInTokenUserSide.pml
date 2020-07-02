@startuml
title DEPLOYMENT - refund in token [User Side]


actor user

== create FutureWallet ==
user -> WalletService: create(name, token)
activate WalletService
WalletService -> SDK: getGasModes
activate SDK
SDK -> WalletService: GasModes
deactivate SDK

WalletService -> FutureWalletFactory: create(name, token, gasPriceInToken)
activate FutureWalletFactory
FutureWalletFactory -> FutureWallet ** : create(name, token, gasPriceInToken)
FutureWalletFactory -> WalletService: futureWallet
deactivate FutureWalletFactory
deactivate WalletService

== waitForBalance ==
user -> FutureWallet: waitForBalance
FutureWallet -> DeploymentReadyObserver: startAndSubscribe
activate DeploymentReadyObserver
loop until balance === gasPriceInToken * DEPLOYMENT_COST
  DeploymentReadyObserver -> Blockchain: getBalance
end
DeploymentReadyObserver -> FutureWallet: resolve promise
FutureWallet -> user: resolve promise


@enduml
