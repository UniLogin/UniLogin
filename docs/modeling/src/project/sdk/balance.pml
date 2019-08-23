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

  class AggregatedBalanceObserver {
    constructor(balanceObserver: BalanceObserver, priceObserver: PriceObserver, tokensValueConverter: TokensValueConverter)
    subscribe(callback: OnAggregatedBalanceChange): Unsubscribe
  }

  class BalanceObserver {
    lastTokenBalances: TokenDetailsWithBalance[]
    callbacks: OnBalanceChange[];
    construtor(balanceChecker: BalanceChecker, walletAddress: string, tokenDetails: TokenDetails[]);
    checkBalancesNow();
    tick()
    subscribe(callback: OnBalanceChange): Unsubscribe
  }

  class PriceObserver {
    lastTokenPrices: TokensPrices;
    callbacks: OnPriceChange[];
    construtor(observedTokens: TokenDetails[], observedCurrencies: ObservedCurrency[]);
    getCurrentPrices();
    tick()
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
}

SDK --> AggregatedBalanceObserver
SDK --> BalanceObserver
BalanceObserver --> BalanceChecker
AggregatedBalanceObserver --> BalanceObserver
AggregatedBalanceObserver --> PriceObserver
AggregatedBalanceObserver --> TokensValueConverter
BalanceObserver --|> ObserverRunner
PriceObserver --|> ObserverRunner

@enduml