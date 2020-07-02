@startuml
title DEPLOYMENT - refund in token [Relayer Side]


== create FutureWallet ==
user -> FutureWalletFactory: createFuture
FutureWalletFactory -> Relayer: addFuture
Relayer -> Handler: addFuture
activate Handler
Handler -> TokenPricesService: getPriceInEth(gasToken)
Handler -> Store: FutureWallet + tokenPriceInEth
deactivate Handler
== deploy ==
user -> Relayer: deploy
Relayer -> DeploymentService: deploy
activate DeploymentService
DeploymentService -> BalanceValidator: validate(address, token, gasPriceInToken)
BalanceValidator -> DeploymentService: balance === DEPLOYMENT_COST * gasPriceInToken
DeploymentService -> Store: getTokenPriceInEth
Store -> DeploymentService: tokenPriceInEth
DeploymentService -> Blockchain: DeployTx (gasPrice = gasPriceInToken/tokenPriceInEth)
DeploymentService -> Relayer: tx hash
Relayer -> user: tx hash
deactivate DeploymentService
@enduml
