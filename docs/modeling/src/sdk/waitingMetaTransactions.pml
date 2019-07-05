@startuml
title Waiting for meta-transactions

actor User
participant SDK
participant Execution
participant RelayerApi
actor Relayer


== Actual waiting ==

User -> SDK: await execute(message, privateKey)
activate SDK
SDK -> RelayerApi: await execute(signedMessage);
RelayerApi -> Relayer: await handleMessage(signedMessage)
activate Relayer
actor Relayer
Relayer -> RelayerApi: messageStatus
RelayerApi -> SDK: messageStatus
SDK -> SDK: await waitForStatus(messageHash)
loop retry
  SDK -> RelayerApi: getStatus(messageHash)
  RelayerApi -> Relayer: getStatus(messageHash)
  ...
  Relayer -> RelayerApi: MessageStatus{ transactionHash | error }
deactivate Relayer
  RelayerApi -> SDK: MessageStatus{ transactionHash | error }
end loop

SDK -> User: MessageStatus
deactivate SDK

== Expected waiting ==
User -> SDK: await execute(message, privateKey)
activate SDK
SDK -> RelayerApi: await execute(signedMessage);
RelayerApi -> Relayer: await handleMessage(signedMessage)
Relayer -> RelayerApi: 201
SDK -> Execution: new
SDK -> User: Execution
deactivate SDK

User -> Execution: await waitForPending()
activate Execution
Execution -> RelayerApi:getStatus
RelayerApi -> Relayer: GET /execution/:messageHash
Execution -> User: Promise<MessageStatus>
deactivate Execution

User -> Execution: await waitForMined()
activate Execution
Execution -> RelayerApi:getStatus
RelayerApi -> Relayer: GET /execution/:messageHash
Execution -> User: Promise<MessageStatus>
deactivate Execution

@enduml
