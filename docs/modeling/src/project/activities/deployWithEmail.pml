@startuml
title Create wallet with email process


actor user
actor SDK
actor Relayer
actor Blockchain

== Process ==
user -> SDK: ensName + e-mail
SDK -> Relayer: ensName + e-mail
activate Relayer
SDK -> user: Wait for e-mail, give us CODE
Relayer -> Relayer: store ensName + e-mail + CODE
Relayer -> user: CODE (via e-mail)
deactivate Relayer
user -> SDK: CODE
SDK -> Relayer: verify CODE
activate Relayer
Relayer -> Relayer: store e-mail OK
Relayer -> SDK: e-mail OK
deactivate Relayer
SDK -> user: e-mail OK
user -> SDK: password
user -> SDK: ETH vs DAI
activate SDK
SDK -> SDK: create future wallet
SDK -> SDK: encrypt wallet with password
SDK -> Relayer: wallet JSON + future wallet
SDK -> user: FutureWallet
deactivate SDK
deactivate SDK
user -> Blockchain: await waitForBalance()
activate Blockchain
Blockchain -> user: Promise<BalanceDetails>
deactivate Blockchain
user -> Relayer: await deploy(ensName)
activate Relayer
Relayer -> user: Promise<string>
actor Relayer
actor Blockchain
deactivate Relayer
deactivate user

@enduml