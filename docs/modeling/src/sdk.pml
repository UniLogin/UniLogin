@startuml

title SDK

class SDK {
  getFutureWallet() : [privateKey, contractAddress]
  intatializeWallet(privateKey, ensName)
  createWallet() : [privateKey, contractAddress]
}

class SupportedToken {
  address: string
  minimalAmount: BigNumber
}

class ObserverBase {
  start()
  stop()
}

class BalanceObserver {
  constructor(walletAddress, SupportedToken [])
  tick()
}

class DeploymentObserver {
  constructor(walletAddress)
  tick()
}

ObserverBase <|-- BalanceObserver
ObserverBase <|-- DeploymentObserver

SDK *-- BalanceObserver
SDK *-- DeploymentObserver

@enduml
