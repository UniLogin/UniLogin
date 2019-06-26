@startuml

actor user

box "Wallet UI"
  participant Login 
  participant Deploy
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

activate Login

user -> Login: ensName

Login -> WalletService: await createFutureWallet()
WalletService -> SDK: await createFutureWallet()
SDK -> FutureWallet: new(...)
WalletService -> WalletStore: setWallet()
WalletService -> Login: Promise<FutureWallet>
Login -> ModalService: showModal('topUpAccount')
Login -> FutureWallet: await waitForBalance() 
activate FutureWallet
ModalService -> Modal: ModalTopUp


activate Modal

user -> Modal: selectPaymentMethod
Modal -> ModalService: showModal('address' || 'safello')

deactivate Modal

ModalService -> Modal: ModalAddress


activate Modal

Login -> ModalService: showModal('deploying')
deactivate Modal

ModalService -> Modal: ModalDeploing
activate Modal
FutureWallet -> Login
deactivate FutureWallet
Login -> FutureWallet: await deploy(ensName)

destroy FutureWallet

Login -> Deploy: redirect('/deploy')

deactivate Login
deactivate Modal

Deploy -> ModalService: showModal('deploying')
activate Deploy

ModalService -> Modal: ModalDeploing
activate Modal
FutureWallet -> Deploy
deactivate FutureWallet
Deploy -> FutureWallet: await deploy(ensName)

Deploy -> HomeScreen: changeScreen()
deactivate Deploy
deactivate Modal
activate HomeScreen

@enduml



activate Deploy

WalletService -> Deploy: {deploy}
user -> Deploy: ensName


Deploy -> blockchain: await deploy(ensName)
ModalService -> Modal: ModalDeploying


activate Modal

Deploy -> HomeScreen: changeScreen()
deactivate Modal
deactivate Deploy
activate HomeScreen



@enduml