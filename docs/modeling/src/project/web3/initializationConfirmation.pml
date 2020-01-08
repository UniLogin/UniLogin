@startuml
title Transaction confirmation

actor User
participant ULWeb3Provider
control UIController
participant Web3Windows

User -> ULWeb3Provider: send() \n //[eth_sendTransaction]//
ULWeb3Provider -> UIController: requireConfirmation()
UIController --> Web3Windows: //set showConfirmation to true//
rnote over Web3Windows
  show confirmation dialog
  which execute onConfirmationResponse
endrnote
ULWeb3Provider -> ULWeb3Provider: resolve requireConfirmation()
@enduml