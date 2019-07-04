@startuml

title Message

[*] --> AwaitSignature
[*] --> Queued
AwaitSignature --> Queued
Queued --> Pending
Pending --> Error
Pending --> Success

@enduml