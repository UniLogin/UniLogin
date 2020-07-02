@startuml
title TRANSFER - free [Relayer Side]

actor user

== add transaction ==
user -> MessageHandler: execute
activate MessageHandler

group gasPrice = 0
  MessageHandler -> RefundPayerValidator: validate(API_KEY, applicationName)
  activate RefundPayerValidator
  RefundPayerValidator -> RefundPayersStore: getApiKey(applicationName)
  RefundPayersStore -> RefundPayerValidator: API_KEY
  RefundPayerValidator -> MessageHandler: refundPayerId
  deactivate RefundPayerValidator
end

MessageHandler -> PendingMessages: add(message, refundPayerId)
deactivate MessageHandler

== add transaction ==
ExecutionWorker -> MessageExecutor: handle
activate MessageExecutor
MessageExecutor -> PendingMessages: getMessage
activate PendingMessages
PendingMessages -> MessageExecutor: message + refundPayerId
deactivate PendingMessages
MessageExecutor -> WalletContractService: messageToTransaction
activate WalletContractService
WalletContractService -> GasPriceOracle: getCurrentGasPrice
WalletContractService -> MessageExecutor: transaction
deactivate WalletContractService
MessageExecutor -> Blockchain: sendTx
MessageExecutor -> FreeExecutionStore: addMessage(hash, refundPayerId, currentGasPrice, gasUsed)
deactivate MessageExecutor

@enduml
