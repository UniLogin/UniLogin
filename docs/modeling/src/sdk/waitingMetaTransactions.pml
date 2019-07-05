@startuml
title Waiting for meta-transactions


actor User
actor SDK
actor Relayer

== Actual waiting ==

User -> SDK: await execute(message, privateKey)
activate SDK
SDK -> relayerApi: await execute(signedMessage);
relayerApi -> Relayer: await handleMessage(signedMessage)
activate Relayer
actor Relayer
Relayer -> relayerApi: messageStatus
relayerApi -> SDK: messageStatus
SDK -> SDK: await waitForStatus(messageHash)
loop retry
  SDK -> relayerApi: getStatus(messageHash)
  relayerApi -> Relayer: getStatus(messageHash)
  ...
  Relayer -> relayerApi: MessageStatus{ transactionHash | error }
deactivate Relayer
  relayerApi -> SDK: MessageStatus{ transactionHash | error }
end loop

SDK -> User: MessageStatus
deactivate SDK

== Expected waiting ==

User -> SDK: await execute(message, privateKey)
activate SDK
SDK -> relayerApi: await execute(signedMessage);
relayerApi -> Relayer: await handleMessage(signedMessage)
activate Relayer
actor Relayer
Relayer -> relayerApi: MessageStatus
relayerApi -> SDK: MessageStatus{messageHash}
SDK -> User: {waitForQueued, waitForPending, waitForFinished, messageStatus}
User -> Relayer: await waitForQueued()
Relayer -> User: messageStatus
User -> Relayer: await waitForPending()
Relayer -> User: messageStatus
User -> Relayer: await waitForFinished()
Relayer -> User: messageStatus

@enduml
