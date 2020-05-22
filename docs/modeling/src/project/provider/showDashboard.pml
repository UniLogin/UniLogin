@startuml

title Show dashboard

actor User
participant App
participant ULIFrameProvider
control Web3

== Activate dashboard ==
User -> App: click 'Show dashboard' button
App -> ULIFrameProvider: openDashboard()
ULIFrameProvider -> Web3: waitUntilReady()
Web3 -> ULIFrameProvider: True
ULIFrameProvider -> Web3: sendRpc()
ULIFrameProvider -> App
App -> User: *Display dashboard for user*

@enduml