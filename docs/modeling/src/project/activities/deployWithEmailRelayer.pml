@startuml
title Create wallet with email process RELAYER SIDE

participant SDK
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
SDK -> EmailConfirmationHandler: confirmEmail(e-mail, CODE)
activate EmailConfirmationHandler
EmailConfirmationHandler -> EmailConfirmationStore: getRequestedWallet
EmailConfirmationHandler -> EmailValidator: validateEmail(e-mail, CODE, Date.now()) isUnique?
EmailValidator -> EmailValidator: is CODE valid? date - now > MARGIN?
EmailConfirmationHandler -> EmailConfirmationStore: update is confirmed
deactivate EmailConfirmationHandler
EmailConfirmationHandler -> SDK: OK

== Store encrypted ==
SDK -> WalletHandler: addEncryptedWallet(wallet JSON, e-mail, code)
WalletHandler -> EmailValidator: isConfirmed(e-mail)
WalletHandler -> EmailValidator: validate(code)
WalletHandler -> WalletsStore: store(wallet JSON, e-mail, ensName)


@enduml