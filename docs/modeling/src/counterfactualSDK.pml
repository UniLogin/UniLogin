@startuml
title getFutureWallet process


actor user
actor SDK
actor Relayer
actor Blockchain

== Process ==

user -> SDK: await getFutureWallet()
activate user
activate SDK
SDK -> FutureWalletFactory: await getFutureWallet()
activate FutureWalletFactory
FutureWalletFactory -> SDK: Promise<FutureWallet>
deactivate FutureWalletFactory
SDK -> user: Promise<FutureWallet>: {contractAddress, privateKey, waitForBalance, deploy}
deactivate SDK
user -> Blockchain: await waitForBalance()
activate Blockchain
Blockchain -> user: Promise<string>
deactivate Blockchain
user -> Relayer: await deploy(ensName)
activate Relayer
Relayer -> user: Promise<Contract>
actor Relayer
actor Blockchain
deactivate Relayer
deactivate user

@enduml