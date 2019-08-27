@startuml

title SDK

package UserInterface {
  class SDK {
    createFutureWallet() : [privateKey, contractAddress]
    walletFrom(privateKey, ensNameOrAddress)
    connectToWallet(walletContractAddress: string)
    getMessageStatus(messageHash)
    getRelayerConfig()
    execute(...);
    selfExecute(...)
  }

  class Wallet {
    futureWallet: FutureWallet
    deployedWallet: DeployedWallet
    type: 'future' | 'deployed' | 'none'
  }

  class WalletBase {
    privateKey: address
    contractAddress: address
    sdk: SDK
  }

  class FutureWallet {
    waitForBalance();
    deploy(ensName);
  }

  class DeployedWallet {
    addKey(key);
    removeKey(key);
    setRequiredSignatures(number);
    getKeyPurpose(key);
    getNonce();
    subscribeToEvent()
    subscribeToBalances()
    subscribeToAggregatedBalance()
    subscribeToPrices()
    subscribeAuthorisations()
  }
}

WalletBase <|-- Wallet
WalletBase <|-- FutureWallet
WalletBase <|-- DeployedWallet
Wallet *-- FutureWallet
Wallet *-- DeployedWallet

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

  class DeploymentReadyObserver {
    constructor(walletAddress, SupportedToken [])
    execute()
  }

  class DeploymentObserver {
    constructor(walletAddress)
    execute()
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

ObserverRunner <|-- DeploymentReadyObserver
ObserverRunner <|-- DeploymentObserver
ObserverRunner <|-- ObserverBase
ObserverBase <|-- BlockchainObserver
ObserverBase <|-- RelayerObserver

FutureWallet *-- DeploymentReadyObserver
FutureWallet *-- DeploymentObserver
DeploymentReadyObserver *-- BlockchainService
DeploymentObserver *-- BlockchainService
BlockchainObserver *-- BlockchainService
RelayerObserver *-- RelayerApi

DeployedWallet *-- BlockchainObserver
DeployedWallet *-- RelayerObserver
PublicRelayerConfig o-- SupportedToken


@enduml
