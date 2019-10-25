@startuml

actor user

box "Wallet UI"
  participant CreateAccount
  participant HomeScreen
  participant Modal #LightGrey
endBox

box "Core"
  participant ModalService
  participant WalletService
end box

box "Integration"
  participant WalletStore
end box

box "SDK" #LightBlue
  actor SDK
  participant FutureWallet
end box

== Creation ==

activate CreateAccount

user -> CreateAccount: ensName

CreateAccount -> WalletService: await createFutureWallet()
WalletService -> SDK: await createFutureWallet()
SDK -> FutureWallet: new(...)
WalletService -> WalletStore: setWallet()
WalletService -> CreateAccount: Promise<FutureWallet>
CreateAccount -> ModalService: showModal('topUpAccount')
CreateAccount -> FutureWallet: await waitForBalance()
activate FutureWallet
ModalService -> Modal: ModalTopUp


activate Modal

user -> Modal: selectPaymentMethod
Modal -> ModalService: showModal('address' || 'safello')

deactivate Modal

ModalService -> Modal: ModalAddress


activate Modal

CreateAccount -> ModalService: showModal('deploying')
deactivate Modal

ModalService -> Modal: ModalDeploing
activate Modal
FutureWallet -> CreateAccount
deactivate FutureWallet
CreateAccount -> FutureWallet: await deploy(ensName)

CreateAccount -> HomeScreen: changeScreen()
deactivate CreateAccount
deactivate Modal
activate HomeScreen



@enduml