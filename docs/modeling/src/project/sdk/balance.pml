@startuml

package ui {
  class SDK {
    subscribeToAggregatedBalance(ensName: string, callback: OnAggregatedBalanceChange)
    subscribeToBalance(ensName: string, callback: OnBalanceChange)
  }
}

package core {
  class ObserverRunner {
    start()
    stop()
    loop()
  }

  class GasModeService {
    constructor(tokensStore: TokensDetailsStore, gasPriceOracle: GasPriceOracle, priceObserver: PriceObserver)
    getModes()
  }

  class AggregatedBalanceObserver {
    constructor(balanceObserver: BalanceObserver, priceObserver: PriceObserver, tokensValueConverter: TokensValueConverter)
    subscribe(callback: OnAggregatedBalanceChange): Unsubscribe
  }

  class BalanceObserver {
    lastTokenBalances: TokenDetailsWithBalance[]
    callbacks: OnBalanceChange[];
    constructor(balanceChecker: BalanceChecker, walletAddress: string, tokenDetails: TokenDetails[]);
    checkBalancesNow();
    execute()
    subscribe(callback: OnBalanceChange): Unsubscribe
  }

  class PriceObserver {
    lastTokenPrices: TokensPrices;
    callbacks: OnPriceChange[];
    constructor(observedTokens: TokenDetails[], observedCurrencies: ObservedCurrency[]);
    getCurrentPrices();
    execute()
    subscribe(callback: OnPriceChange): Unsubscribe
  }
}

package commons {
    class TokensValueConverter {
    constructor(observedCurrencies: ObservedCurrency[]);
    getTotal(tokensDetailsWithBalance: TokenDetailsWithBalance[], tokensPrices: TokensPrices)
    getTokensTotalWorth(tokensDetailsWithBalance: TokenDetailsWithBalance[], tokensPrices: TokensPrices)
    getTokenTotalWorth(balance: utils.BigNumber, tokenPrices: CurrencyToValue)
  }
}

package integration {
  class BalanceChecker {
    constructor(provider: Provider);
    getBalance(address: string);
    getEtherBalance(address: string);
    getERC20Balance(address: string);
  }

  class GasPriceOracle {
    constructor(provider: providers.Provider)
    getGasPrices()
  }
}

SDK --> AggregatedBalanceObserver
SDK --> BalanceObserver
BalanceObserver --> BalanceChecker
AggregatedBalanceObserver --> BalanceObserver
AggregatedBalanceObserver --> PriceObserver
AggregatedBalanceObserver --> TokensValueConverter
BalanceObserver --|> ObserverRunner
PriceObserver --|> ObserverRunner
GasModeService --> GasPriceOracle
GasModeService --> PriceObserver
SDK --> GasModeService

@enduml