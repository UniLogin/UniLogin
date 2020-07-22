@startuml
title Connect wallet with email process


actor user
actor SDK
actor Relayer
actor Blockchain

== Process ==
user -> SDK: connect to ensName
activate SDK
note right: Starting waiting for code
SDK -> Relayer: connect ensName
activate Relayer
SDK -> user: Wait for e-mail, give us CODE
Relayer -> Relayer: store ensName + e-mail + CODE
Relayer -> user: CODE (via e-mail)
deactivate Relayer
user -> SDK: CODE
deactivate SDK
SDK -> Relayer: verify CODE
activate Relayer
Relayer -> SDK: walletJSON
deactivate Relayer
activate SDK
note left: Start waiting for password
user -> SDK: password
deactivate SDK
SDK -> SDK: encode wallet
note left: Restoring DeployedWallet
SDK -> SDK: create deployed

@enduml