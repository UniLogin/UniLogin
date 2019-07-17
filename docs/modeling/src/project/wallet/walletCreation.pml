@startuml
  actor user

  box "Wallet UI" #LightBlue
    participant Login 
    participant Modal #LightGrey
    participant HomeScreen
  endBox
  box "Wallet Services"
    participant Creation
    participant ModalService
    participant WalletService
    participant BalanceService
    participant EtherBalanceService
  end box
  actor blockchain

  == Creation ==

  activate BalanceService #FFBBBB
  
  BalanceService -> BalanceService: startLoop()
  
  activate Login
  
  BalanceService -> EtherBalanceService: getBalance()
  WalletService -> EtherBalanceService: {contractAddress}
  EtherBalanceService -> blockchain: getBalance(contractAddress)
  user -> Login: input(name)
  Login -> Creation: createWallet(name)
  Creation -> WalletService: {privateKey, contractAddress, name}
  Login -> BalanceService: subscribe(callback)
  
  Login -> ModalService: showModal('topUpAccount')
  ModalService -> Modal: ModalTopUp
  
  activate Modal
  
  user -> Modal: selectPaymentMethod
  Modal -> ModalService: showModal('address' || 'safello')
  
  deactivate Modal

  ModalService -> Modal: ModalAddress
  
  activate Modal
  
  WalletService -> Modal: {contractAddress}

  user -> blockchain: "transfer"
  BalanceService -> EtherBalanceService: getBalance()
  WalletService -> EtherBalanceService: {contractAddress}
  EtherBalanceService -> blockchain: getBalance(contractAddress)
  blockchain -> EtherBalanceService: changedBalance
  EtherBalanceService -> BalanceService: changedBalance
  BalanceService -> Login: callback()
  Login -> HomeScreen: loginAndChangeScreen()
  
  deactivate Login
  deactivate Modal 
  activate HomeScreen

  HomeScreen -> BalanceService: subscribe(callback)
  
@enduml