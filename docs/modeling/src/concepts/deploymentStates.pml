@startuml DeploymentStates

title Deployment States

state SDK {
  [*] -right-> WaitForBalance
}
state Relayer {
  WaitForBalance -right-> Queued
  Queued -right-> Pending
  Pending -right-> Success
  Pending -right-> Error
  Error --> Queued
}
@enduml