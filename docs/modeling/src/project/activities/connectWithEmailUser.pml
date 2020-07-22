@startuml
title Create wallet with email process USER SIDE


actor user
participant WalletService
participant RequestedRestoring
participant RestoringWallet
participant Relayer

== Process ==
user -> WalletService: requestRestoringWallet(e-mail, ensName)
activate WalletService
note right: Waiting for code
WalletService -> RequestedRestoring **: requestEmailConfirmation
RequestedRestoring -> Relayer: requestEmailConfirmation
Relayer -> user: CODE
user -> WalletService: confirmEmail(CODE)
deactivate WalletService
WalletService -> RequestedRestoring: confirmEmail(CODE)
RequestedRestoring -> Relayer: confirmEmail(CODE)
Relayer -> WalletService: confirmed + walletJSON + contractAddress +
activate WalletService
note left: Waiting for password
WalletService -> RestoringWallet **: createRestoringWallet
user -> WalletService: password
deactivate WalletService
WalletService -> RestoringWallet: restore(password)
RestoringWallet -> WalletService: DeployedWallet
WalletService -> user: DeployedWallet



@enduml