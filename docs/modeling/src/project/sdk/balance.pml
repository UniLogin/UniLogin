@startuml

package client {
  class Example {
    balanceChanged(tokensWithBalances: Map<address, balance>)
  }
}

package ui {
  class SDK {
    onBalanceChanged(walletAddress: string, tokens: string[], callback: Function)
  }
}

package core {
  class ObserverRunner {
    start()
    stop()
    loop()
  }

  class BalanceObserver {
    readonly public balances: Map<address, balance>
    construtor(provider, walletAddress: string, tokens: string[], {tick, intialBalances?});
    getInitialBalances();
    checkBalancesNow();
    tick()
    subscribe(callback: Function): Function
  }

  class AggregatedBalanceObserver {
    constructor(balanceObserver: BalanceObserver, currency: string)
    subscribe(callback: Function): Function
  }
}

package integration {
  class PriceOracle {
    getRate(currency, tokenAddress)
  }

  class BalanceChecker {
    constructor(provider: Provider);
    getBalance(address: string);
    getEtherBalance(address: string);
    getERC20Balance(address: string);
  }
}

Example --> SDK
SDK --> BalanceObserver
BalanceObserver --> BalanceChecker
BalanceObserver --|> ObserverRunner

@enduml