@startuml

title Wallet


package UserInterface {
  package Common {

  }

  package Home {
    class Balance {
      balance
    }

    class HomeScreen {

    }
  }

  package Login {
    class ApproveScreen {

    }
    class Login {
      onCreateClick()
      onConnectionClick()
    }
    
    class RecoveryScreen {

    }

    class Spinner {

    }

    class Suggestions {
      getSuggestionsItems()
    }

    class TransferringFundsScreen {

    }

    class WalletSelector {
      busy
      connections
      creations
    }
  }

  package Modal {

  }

  package Notifications {
  }

  package Setting {
  }

  class App {

  }

  class CustomBrowserRouter {

  }
  
  class Navigation {

  }

  class NotFount {

  }

  class PrivateRoute {

  }
}

package universal-login-commons {

  class SuggestionsService {

  }

  class WalletSelectionService {

  }
}

package Services {
  class SDK {

  }

  class BalanceService {
    loop()
    subscribe(callback)
  }

  class EtherBalanceService {
    getBalance()
  }

  class ConnectToWallet {
    connectToWallet()
  }

  class Creation {
    createWallet(ensName)
  }

  class ModalService {
    subscribe(callback)
  }

  class Notifications {
    subscribe()
    reject()
    confirm()
  }

  class TokenService {
    tokenDetails: TokenDetails[]
    start()
    getTokenAddress()
    provider
  }

  class TransferService {
    transfer(details)
  }

  class UserDropdownService {
    setDropdownVisibility(dropdownType)
    subscribe()
  }

  class WalletService {
    userWallet: UserWallet
    walletExists(): boolean
    isAuthorized(): boolean
    disconnect(): void
  }

}

HomeScreen --|> Balance
HomeScreen --|> Common
HomeScreen --|> ModalService
HomeScreen --|> Modal

Balance --|> BalanceService

Common --|> UserDropdownService

ApproveScreen --|> WalletService
ApproveScreen --|> Spinner

Login --|> Creation
Login --|> ModalService
Login --|> BalanceService
Login --|> ConnectToWallet
Login --|> Modal
Login --|> WalletSelector

RecoveryScreen --|> Common

TransferringFundsScreen --|> Spinner
TransferringFundsScreen --|> Common

WalletSelector --|> SuggestionsService
WalletSelector --|> Common
WalletSelector --|> Suggestions

Modal --|> WalletService
Modal --|> Common
Modal --|> ModalService
Modal --|> TransferService
Modal --|> TokenService

App --|> PrivateRoute
App --|> WalletService
App --|> Setting
App --|> ApproveScreen
App --|> Login
App --|> HomeScreen
App --|> TransferringFundsScreen
App --|> NotFount
App --|> Notifications
App --|> RecoveryScreen


BalanceService --|> EtherBalanceService

EtherBalanceService --|> WalletService

ConnectToWallet --|> WalletService
ConnectToWallet --|> SDK

Creation --|> WalletService
Creation --|> SDK

Notifications --|> WalletService
Notifications --|> SDK

TransferService --|> TokenService
TransferService --|> WalletService

TransferService --|> SDK

SuggestionsService --|> SDK
SuggestionsService --|> WalletSelectionService


@enduml