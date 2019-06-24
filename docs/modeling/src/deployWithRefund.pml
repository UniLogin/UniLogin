@startuml

title Contract deployment

actor user

== Wallet Contract deployment ==
user-> SDK: getFutureWallet()
SDK-> user: [privateKey, contractAddress]
user -> Relayer: createContract(publicKey, ensName)
Relayer->Factory: createContract(publicKey, initializeWithENS)
activate Factory
Factory->Proxy: deploy()

Factory->Proxy: initializeWithENS()

Proxy->Relayer: refund
Factory->Relayer: success
deactivate Factory
Relayer->user: callback()

@enduml