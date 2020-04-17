@startuml
title free tx [User Side]

actor user

== add transaction ==
user -> MessageHandler: execute
activate MessageHandler
MessageHandler -> TokenPrices: getPriceInEth(gasToken)
MessageHandler -> PendingMessages: add(message + tokenPriceInEth)
deactivate MessageHandler

== add transaction ==
ExecutionWorker -> MessageExecutor: handle
activate MessageExecutor
MessageExecutor -> PendingMessages: getMessage
activate PendingMessages
PendingMessages -> MessageExecutor: message + tokenPriceInEth
deactivate PendingMessages
MessageExecutor -> WalletContractService: messageToTransaction
MessageExecutor -> Blockchain: tx(gasPrice = message.gasPrice/tokenPriceInEth)
deactivate MessageExecutor

@enduml
