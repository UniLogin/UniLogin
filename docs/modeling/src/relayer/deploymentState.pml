@startuml

title Deployment

[*] --> Queued
Queued --> Pending
Pending --> Success
Pending --> Error
Error --> Queued

@enduml