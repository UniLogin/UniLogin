@startuml
title TRANSFER - free [User Side]

actor user

== add transaction ==
user -> WalletService: execute
activate WalletService
WalletService -> SDK: isRefundPaid
WalletService -> Relayer: execute(message + gasPrice = 0)
deactivate WalletService

@enduml
