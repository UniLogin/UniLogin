@startuml

title Deployment

actor SDK
actor Relayer

== Deployment ==

SDK -> SDK: getFutureWallet
SDK -> Relayer: /wallet/deploy
activate Relayer
Relayer -> Factory: createContract(publicKey, ENSDomain)
deactivate Relayer
activate Factory
Factory -> Proxy: new(publicKey)
Factory -> Proxy: initializeWithENS(publicKey, ENSDomain)
Proxy -> WalletMaster: (d)initializeWithENS(publicKey, ENSDomain)
deactivate Factory

@enduml