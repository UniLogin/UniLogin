@startuml MessageStates

title Message States

[*] -right-> AwaitSignature
[*] -right-> Queued
AwaitSignature -right-> Queued
Queued -right-> Pending
Pending --> Error
Pending -right-> Success

@enduml