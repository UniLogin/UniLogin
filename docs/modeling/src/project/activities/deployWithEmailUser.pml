@startuml
title Create wallet with email process USER SIDE


actor user
participant WalletService
participant ConfirmedWallet
participant RequestedWallet
participant FutureWalletFactory
participant FutureWallet
participant Relayer

== Process ==
user -> WalletService: createRequested(e-mail, ensName)

WalletService -> RequestedWallet **: createRequested
WalletService -> RequestedWallet: requestEmailConfirmation
RequestedWallet -> Relayer: requestEmailConfirmation
WalletService -> user: waitForCodes
Relayer -> user: CODE
user -> WalletService: confirmEmail(CODE)
WalletService -> RequestedWallet: confirmEmail(CODE)
RequestedWallet -> Relayer: confirmEmail(CODE)
Relayer -> RequestedWallet: confirmed
RequestedWallet -> ConfirmedWallet **
RequestedWallet -> WalletService: confirmed
WalletService -> user: confirmed
user -> WalletService: password, ETH or DAI
user -> WalletService: createFutureWallet(password, ETH)
WalletService -> FutureWalletFactory: createFutureWallet(password, ETH, code)
activate FutureWalletFactory
FutureWalletFactory -> FutureWalletFactory: generate priv + public
FutureWalletFactory -> FutureWalletFactory: encrypt priv + public with password
FutureWalletFactory -> Relayer: addFutureWallet()
FutureWalletFactory -> Relayer: addEncryptedWallet (wallet JSON, code)
FutureWalletFactory -> FutureWallet **: new Future(ETH or DAI)
FutureWalletFactory -> WalletService: FutureWallet
deactivate FutureWalletFactory
WalletService -> user: FutureWallet




@enduml