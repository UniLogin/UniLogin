@startuml

title Connect

actor User
actor DApp1
participant SDK1
participant Relayer
participant SDK2
actor DApp2

== Request connection ==
User -> DApp1: enters ens address
DApp1 -> SDK1: connect(ensAddress)
activate SDK1
SDK1 -> Relayer: POST /authorisation/:wallet
activate Relayer
SDK1 <- Relayer: 201
deactivate Relayer
DApp1 <- SDK1: {privateKey, securityCode}
deactivate SDK1

== Get connections ==

SDK2 <- DApp2: fetchPendingAuthorisations()
Relayer <- SDK2: "GET /authorisation/:wallet"
activate Relayer
Relayer -> SDK2: [{publicKey}, ...]
deactivate Relayer
SDK2 -> DApp2: [{publicKey, securityCode}, ...]

== Confirm connection ==

User -> DApp2: securityCode
activate DApp2
DApp2 -> SDK2: addKey(publicKey)
SDK2 -> Relayer: POST /wallet/execution
activate Relayer
SDK2 <- Relayer: MessageStatus
deactivate Relayer
DApp2 <- SDK2: MessageStatus
deactivate DApp2

== Deny connection ==
User -> DApp2: click 'Cancel'
DApp2 -> SDK2: denyRequest(publicKey)
SDK2 -> Relayer: denyRequest(publicKey)


@enduml