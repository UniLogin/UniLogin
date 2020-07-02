@startuml
title DEPLOYMENT - free [User Side]

actor User

== free deployment ==
User -> WalletService: createFutureWallet(name)
activate WalletService
WalletService -> SDK: isFreeDeployment?
activate SDK
SDK -> SDK:
SDK -> WalletService: isFreeDeployment
deactivate SDK
alt free deployment
  WalletService -> FutureWallet **: create(gasPrice = 0)
  WalletService -> FutureWallet: deploy
else deployment with refund
  WalletService -> GasModeService: getGasModes
  WalletService -> FutureWallet **: create(fastGasPrice)
end
@enduml
