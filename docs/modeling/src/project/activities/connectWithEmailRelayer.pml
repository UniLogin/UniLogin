@startuml
title Connect wallet with email process RELAYER SIDE

participant SDK
participant RestoringWalletHandler
participant EmailConfirmationHandler
participant EmailValidator
participant EmailConfirmationStore
participant EmailService

== Send e-mail ==

SDK -> EmailConfirmationHandler: requestEmailConfirmation(e-mail, ensName)
EmailConfirmationHandler -> EmailConfirmationHandler: generate CODE
EmailConfirmationHandler -> EmailConfirmationStore: store(e-mail, ensName, CODE, date, confirmed = false)
EmailConfirmationHandler -> EmailService: sendEmail(e-mail, CODE, ensName)
EmailService ->

== Confirm e-mail ==
SDK -> RestoringWalletHandler: restoreWallet(e-mail, code, ensName)
RestoringWalletHandler -> EmailConfirmationHandler: confirmEmail(e-mail, CODE)
activate EmailConfirmationHandler
EmailConfirmationHandler -> EmailConfirmationStore: getRequestedWallet
EmailConfirmationHandler -> EmailValidator: validateEmail(e-mail, CODE, Date.now())
EmailValidator -> EmailValidator: is CODE valid? date - now > MARGIN?
EmailConfirmationHandler -> EmailConfirmationStore: update is confirmed
deactivate EmailConfirmationHandler
EmailConfirmationHandler -> RestoringWalletHandler: OK
RestoringWalletHandler -> WalletsStore: getEncryptedWallet(ensName)
WalletsStore -> RestoringWalletHandler: enrypted wallet
RestoringWalletHandler -> SDK: encrypted wallet


@enduml