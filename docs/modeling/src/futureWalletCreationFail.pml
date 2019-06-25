@startuml

actor user

box "Wallet UI" #LightBlue
  participant Login 
  participant Deploy
  participant Modal #LightGrey
  participant HomeScreen
endBox
actor SDK
box "Wallet Services"
  participant Creation
  participant ModalService
  participant WalletService
end box
actor blockchain

== Creation ==

activate Login

user -> Login: ensName

Login -> SDK: await getFutureWallet()
SDK -> Login: Promise<FutureWallet: {contractAddress, waitForBalance, deploy, privateKey}>
Login -> WalletService: {FutureWallet}
Login -> ModalService: showModal('topUpAccount')
Login -> blockchain: await waitForBalance() 
ModalService -> Modal: ModalTopUp


activate Modal

user -> Modal: selectPaymentMethod
Modal -> ModalService: showModal('address' || 'safello')

deactivate Modal

ModalService -> Modal: ModalAddress


activate Modal

user -> blockchain: "transfer"
Login -> ModalService: showModal('deploying')
deactivate Modal

ModalService -> Modal: ModalDeploing
activate Modal
Login -> blockchain: await deploy(ensName)
destroy blockchain


Login -> Deploy: redirect('/deploy')

deactivate Login
deactivate Modal
activate Deploy

WalletService -> Deploy: {deploy}
user -> Deploy: ensName

Deploy -> ModalService: showModal('deploying')

Deploy -> blockchain: await deploy(ensName)
ModalService -> Modal: ModalDeploying


activate Modal

Deploy -> HomeScreen: changeScreen()
deactivate Modal
deactivate Deploy
activate HomeScreen



@enduml