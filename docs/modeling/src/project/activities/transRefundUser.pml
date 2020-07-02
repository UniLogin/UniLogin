@startuml
title TRANSFER - refund in token [Relayer Side]

actor user

== add transaction ==
user -> Relayer: execute
Relayer -> MessageHandler: execute
activate MessageHandler
MessageHandler -> TokenPrices: getPriceInEth(gasToken)
MessageHandler -> PendingMessages: add(message + tokenPriceInEth)
deactivate MessageHandler

== send transaction ==
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
