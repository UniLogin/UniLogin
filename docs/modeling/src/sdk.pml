@startuml

title SDK

package UserInterface {
  class SDK {
    getFutureWallet() : [privateKey, contractAddress]
    intatializeWallet(privateKey, ensName)
    createWallet() : [privateKey, contractAddress]
  }

  class FutureWallet {
    privateKey: address
    contractAddress: address
    waitForBalance()
    waitForDeploy()
  }
}

package Core {
  class PublicRelayerConfig {
    supportedTokens: SupportedToken[];
    factoryAddress: string;
    chainSpec: ChainSpec;
    contractWhiteList: ContractWhiteList;
  }

  class SupportedToken {
    address: string
    minimalAmount: BigNumber
  }
}

package Domain {
  class ObserverRunner {
    start()
    stop()
  }

  class ObserverBase {
    subscribe(...)
  }

  class BalanceObserver {
    constructor(walletAddress, SupportedToken [])
    tick()
  }

  class DeploymentObserver {
    constructor(walletAddress)
    tick()
  }

  class BlockchainObserver {
    fetchEvents();
  }

  class RelayerObserver {
    checkAuthorisationRequests();
  }
}

package Integration {
  class RelayerApi {
    createWallet(managementKey: string, ensName: string)
    getConfig()
    execute(message: any)
    getStatus(messageHash: string)
    connect(walletContractAddress: string, key: string)
    denyConnection(walletContractAddress: string, key: string)
    getPendingAuthorisations(walletContractAddress: string)
  }

  class BlockchainService {
    getCode(contractAddress: string)
    getBlockNumber()
    getLogs(eventsFilter)
    getBalance(token)
  }
}

SDK .. FutureWallet

ObserverRunner <|-- BalanceObserver
ObserverRunner <|-- DeploymentObserver
ObserverRunner <|-- ObserverBase
ObserverBase <|-- BlockchainObserver
ObserverBase <|-- RelayerObserver

FutureWallet *-- BalanceObserver
FutureWallet *-- DeploymentObserver
BalanceObserver *-- BlockchainService
DeploymentObserver *-- BlockchainService
BlockchainObserver *-- BlockchainService
RelayerObserver *-- RelayerApi

SDK *-- BlockchainObserver
SDK *-- RelayerObserver
PublicRelayerConfig o-- SupportedToken


@enduml
