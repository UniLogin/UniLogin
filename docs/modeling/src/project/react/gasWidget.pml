@startuml


package UI {
  class FeeWidget {
    mode: Mode
    option: GasOption
    gasModeService: GasModeService
  }
}

package Domain {

  class GasModeService {
    async getModes()
  }

  class GasMode {
    name: string
    ETA: number
  }

  class GasOption {
    gasToken: Token
    tokenBalance: BigNumber
    gasPrice: BigNumber
    estimatedFee: BigNumber
    estimatedFeeInCurrency: BigNumber
  }

  class GasPriceOracle {
    ...
  }


  class BalanceObserver {
    ...
  }

  class PriceObserver {
    ...
  }

}

GasModeService *-- GasMode
GasMode *-- GasOption
GasModeService --> GasPriceOracle
GasModeService --> BalanceObserver
GasModeService --> PriceObserver

FeeWidget --> GasModeService
FeeWidget --> GasOption
FeeWidget --> GasMode

@enduml